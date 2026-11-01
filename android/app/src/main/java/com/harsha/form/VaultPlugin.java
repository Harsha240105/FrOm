package com.harsha.form;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

@CapacitorPlugin(name = "Vault")
public class VaultPlugin extends Plugin {
    private static final String PREFS = "form_vault";
    private static final String KEY_SALT = "salt";
    private static final String KEY_CHECK = "check";
    private static final String CHECK_TEXT = "FORM_VAULT_V1";
    private static final int ITERATIONS = 600000;
    private static final int KEY_BITS = 256;
    private static final int SALT_BYTES = 16;
    private static final int IV_BYTES = 12;
    private static final int TAG_BITS = 128;
    private static final int CHECK_TEXT_BYTES = 12;
    private static final int MAX_PHOTO_BYTES = 15 * 1024 * 1024;
    private static final Pattern SAFE_NAME = Pattern.compile("^[0-9]{4}-[0-9]{2}-[0-9]{2}_[A-Za-z0-9-]+\\.bin$");
    private static final Pattern SAFE_DATE = Pattern.compile("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");

    private SecretKey key;

    private SharedPreferences prefs() {
        return getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    private File vaultDir() {
        File dir = new File(getContext().getFilesDir(), "vault");
        if (!dir.exists()) dir.mkdirs();
        return dir;
    }

    private boolean configured() {
        return prefs().contains(KEY_SALT) && prefs().contains(KEY_CHECK);
    }

    private SecretKey derive(String password, byte[] salt) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_BITS);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] raw = factory.generateSecret(spec).getEncoded();
        try {
            return new SecretKeySpec(raw, "AES");
        } finally {
            Arrays.fill(raw, (byte) 0);
            spec.clearPassword();
        }
    }

    private static byte[] encrypt(SecretKey key, byte[] plain) throws Exception {
        byte[] iv = new byte[IV_BYTES];
        new SecureRandom().nextBytes(iv);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(TAG_BITS, iv));
        byte[] body = cipher.doFinal(plain);
        ByteArrayOutputStream out = new ByteArrayOutputStream(iv.length + body.length);
        out.write(iv);
        out.write(body);
        return out.toByteArray();
    }

    private static byte[] decrypt(SecretKey key, byte[] data, int offset) throws Exception {
        if (data.length - offset < IV_BYTES + 16) throw new Exception("Encrypted data is incomplete.");
        byte[] iv = Arrays.copyOfRange(data, offset, offset + IV_BYTES);
        byte[] body = Arrays.copyOfRange(data, offset + IV_BYTES, data.length);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(TAG_BITS, iv));
        return cipher.doFinal(body);
    }

    private byte[] encryptBytes(byte[] plain) throws Exception {
        if (key == null) throw new Exception("Vault is locked.");
        return encrypt(key, plain);
    }

    private byte[] decryptBytes(byte[] data) throws Exception {
        if (key == null) throw new Exception("Vault is locked.");
        return decrypt(key, data, 0);
    }

    private JSObject status() {
        JSObject result = new JSObject();
        result.put("configured", configured());
        result.put("unlocked", key != null);
        File[] entries = vaultDir().listFiles();
        result.put("count", entries == null ? 0 : entries.length);
        return result;
    }

    @PluginMethod
    public void status(PluginCall call) {
        call.resolve(status());
    }

    @PluginMethod
    public void setup(PluginCall call) {
        String password = call.getString("password", "");
        if (configured()) {
            call.reject("A vault password already exists.");
            return;
        }
        if (password.length() < 8) {
            call.reject("Use at least 8 characters.");
            return;
        }
        try {
            byte[] salt = new byte[SALT_BYTES];
            new SecureRandom().nextBytes(salt);
            key = derive(password, salt);
            byte[] check = encrypt(key, CHECK_TEXT.getBytes(StandardCharsets.UTF_8));
            prefs().edit()
                    .putString(KEY_SALT, Base64.encodeToString(salt, Base64.NO_WRAP))
                    .putString(KEY_CHECK, Base64.encodeToString(check, Base64.NO_WRAP))
                    .apply();
            call.resolve(status());
        } catch (Exception e) {
            key = null;
            call.reject("Could not create the vault.");
        }
    }

    @PluginMethod
    public void unlock(PluginCall call) {
        String password = call.getString("password", "");
        if (!configured()) {
            call.reject("Set a vault password first.");
            return;
        }
        try {
            byte[] salt = Base64.decode(prefs().getString(KEY_SALT, ""), Base64.NO_WRAP);
            SecretKey candidate = derive(password, salt);
            byte[] check = Base64.decode(prefs().getString(KEY_CHECK, ""), Base64.NO_WRAP);
            String value = new String(decrypt(candidate, check, 0), StandardCharsets.UTF_8);
            if (!CHECK_TEXT.equals(value)) throw new Exception("Wrong password.");
            key = candidate;
            call.resolve(status());
        } catch (Exception e) {
            key = null;
            call.reject("Wrong password.");
        }
    }

    @PluginMethod
    public void lock(PluginCall call) {
        key = null;
        call.resolve(status());
    }

    @PluginMethod
    public void list(PluginCall call) {
        JSArray files = new JSArray();
        File[] entries = vaultDir().listFiles();
        if (entries != null) {
            Arrays.sort(entries, (a, b) -> b.getName().compareTo(a.getName()));
            for (File file : entries) {
                if (!file.isFile() || !SAFE_NAME.matcher(file.getName()).matches()) continue;
                JSObject item = new JSObject();
                item.put("name", file.getName());
                item.put("date", file.getName().substring(0, 10));
                item.put("size", file.length());
                files.put(item);
            }
        }
        JSObject result = status();
        result.put("files", files);
        call.resolve(result);
    }

    @PluginMethod
    public void save(PluginCall call) {
        if (key == null) {
            call.reject("Vault is locked.");
            return;
        }
        String date = call.getString("date", "");
        String mime = call.getString("mime", "");
        String data = call.getString("data", "");
        if (!SAFE_DATE.matcher(date).matches()) {
            call.reject("Invalid date.");
            return;
        }
        if (mime == null || !mime.startsWith("image/")) {
            call.reject("Only image files are supported.");
            return;
        }
        try {
            byte[] raw = Base64.decode(data, Base64.NO_WRAP);
            if (raw.length == 0 || raw.length > MAX_PHOTO_BYTES) {
                call.reject("Photo is empty or too large.");
                return;
            }
            JSONObject payload = new JSONObject();
            payload.put("mime", mime);
            payload.put("data", Base64.encodeToString(raw, Base64.NO_WRAP));
            byte[] encrypted = encryptBytes(payload.toString().getBytes(StandardCharsets.UTF_8));
            String name = date + "_" + UUID.randomUUID().toString() + ".bin";
            File target = new File(vaultDir(), name);
            File temp = new File(vaultDir(), name + ".tmp");
            try (FileOutputStream out = new FileOutputStream(temp)) {
                out.write(encrypted);
                out.getFD().sync();
            }
            if (!temp.renameTo(target)) throw new Exception("Could not save photo.");
            JSObject result = status();
            result.put("name", name);
            result.put("date", date);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Could not save the photo.");
        }
    }

    @PluginMethod
    public void read(PluginCall call) {
        if (key == null) {
            call.reject("Vault is locked.");
            return;
        }
        String name = call.getString("name", "");
        File file = safeFile(name);
        if (file == null || !file.isFile()) {
            call.reject("Photo not found.");
            return;
        }
        try {
            byte[] encrypted = readAll(file);
            JSONObject payload = new JSONObject(new String(decryptBytes(encrypted), StandardCharsets.UTF_8));
            JSObject result = new JSObject();
            result.put("name", name);
            result.put("date", name.substring(0, 10));
            result.put("mime", payload.getString("mime"));
            result.put("data", payload.getString("data"));
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Could not open the photo.");
        }
    }

    @PluginMethod
    public void delete(PluginCall call) {
        if (key == null) {
            call.reject("Vault is locked.");
            return;
        }
        String name = call.getString("name", "");
        File file = safeFile(name);
        if (file == null || !file.isFile()) {
            call.reject("Photo not found.");
            return;
        }
        if (!file.delete()) {
            call.reject("Could not delete the photo.");
            return;
        }
        call.resolve(status());
    }

    @PluginMethod
    public void exportConfig(PluginCall call) {
        if (!configured()) {
            call.reject("Vault is not configured.");
            return;
        }
        JSObject result = new JSObject();
        result.put("salt", prefs().getString(KEY_SALT, ""));
        result.put("check", prefs().getString(KEY_CHECK, ""));
        call.resolve(result);
    }

    @PluginMethod
    public void importConfig(PluginCall call) {
        boolean replace = Boolean.TRUE.equals(call.getBoolean("replace", false));
        if (configured() && !replace) {
            call.reject("A vault already exists on this device.");
            return;
        }
        String salt = call.getString("salt", "");
        String check = call.getString("check", "");
        try {
            byte[] saltBytes = Base64.decode(salt, Base64.NO_WRAP);
            byte[] checkBytes = Base64.decode(check, Base64.NO_WRAP);
            if (saltBytes.length != SALT_BYTES || checkBytes.length < IV_BYTES + TAG_BITS / 8 + CHECK_TEXT_BYTES) {
                throw new Exception("Invalid vault configuration.");
            }
            prefs().edit().putString(KEY_SALT, salt).putString(KEY_CHECK, check).apply();
            key = null;
            call.resolve(status());
        } catch (Exception e) {
            call.reject("Invalid vault configuration.");
        }
    }

    @PluginMethod
    public void restoreBundle(PluginCall call) {
        String salt = call.getString("salt", "");
        String check = call.getString("check", "");
        JSArray files = call.getArray("files");
        if (files == null) files = new JSArray();
        File staging = new File(getContext().getFilesDir(), "vault-staging-" + UUID.randomUUID());
        File current = new File(getContext().getFilesDir(), "vault");
        File old = new File(getContext().getFilesDir(), "vault-old-" + UUID.randomUUID());
        boolean movedOld = false;
        boolean movedNew = false;
        try {
            byte[] saltBytes = Base64.decode(salt, Base64.NO_WRAP);
            byte[] checkBytes = Base64.decode(check, Base64.NO_WRAP);
            if (saltBytes.length != SALT_BYTES || checkBytes.length < IV_BYTES + TAG_BITS / 8 + CHECK_TEXT_BYTES) {
                throw new Exception("Invalid vault configuration.");
            }
            if (!staging.mkdirs()) throw new Exception("Could not prepare the restore.");
            List<String> names = new ArrayList<>();
            List<byte[]> blobs = new ArrayList<>();
            for (int i = 0; i < files.length(); i++) {
                JSONObject item = files.getJSONObject(i);
                String name = item.optString("name", "");
                if (!SAFE_NAME.matcher(name).matches() || names.contains(name)) {
                    throw new Exception("Invalid vault file name.");
                }
                byte[] data = Base64.decode(item.optString("data", ""), Base64.NO_WRAP);
                if (data.length < 16 || data.length > MAX_PHOTO_BYTES + 4096) {
                    throw new Exception("Invalid vault file.");
                }
                names.add(name);
                blobs.add(data);
            }
            for (int i = 0; i < names.size(); i++) {
                File target = new File(staging, names.get(i));
                try (FileOutputStream out = new FileOutputStream(target)) {
                    out.write(blobs.get(i));
                    out.getFD().sync();
                }
            }
            if (current.exists()) {
                if (!current.renameTo(old)) throw new Exception("Could not stage the current vault.");
                movedOld = true;
            }
            if (!staging.renameTo(current)) throw new Exception("Could not install the restored vault.");
            movedNew = true;
            boolean saved = prefs().edit()
                    .putString(KEY_SALT, salt)
                    .putString(KEY_CHECK, check)
                    .commit();
            if (!saved) throw new Exception("Could not save the vault configuration.");
            key = null;
            if (movedOld) deleteTree(old);
            call.resolve(status());
        } catch (Exception e) {
            if (movedNew) deleteTree(current);
            if (movedOld) old.renameTo(current);
            deleteTree(staging);
            call.reject("Could not restore the encrypted photos.");
        }
    }

    @PluginMethod
    public void exportFiles(PluginCall call) {
        JSArray files = new JSArray();
        File[] entries = vaultDir().listFiles();
        if (entries != null) {
            Arrays.sort(entries, (a, b) -> a.getName().compareTo(b.getName()));
            for (File file : entries) {
                if (!file.isFile() || !SAFE_NAME.matcher(file.getName()).matches()) continue;
                try {
                    JSObject item = new JSObject();
                    item.put("name", file.getName());
                    item.put("data", Base64.encodeToString(readAll(file), Base64.NO_WRAP));
                    files.put(item);
                } catch (Exception e) {
                    call.reject("Could not read the encrypted photos.");
                    return;
                }
            }
        }
        JSObject result = new JSObject();
        result.put("files", files);
        call.resolve(result);
    }

    @PluginMethod
    public void importFiles(PluginCall call) {
        JSArray files = call.getArray("files");
        if (files == null) {
            call.reject("No vault files supplied.");
            return;
        }
        int imported = 0;
        List<File> temps = new ArrayList<>();
        try {
            List<String> names = new ArrayList<>();
            List<byte[]> blobs = new ArrayList<>();
            for (int i = 0; i < files.length(); i++) {
                JSONObject item = files.getJSONObject(i);
                String name = item.optString("name", "");
                if (!SAFE_NAME.matcher(name).matches()) throw new Exception("Invalid vault file name.");
                byte[] data = Base64.decode(item.optString("data", ""), Base64.NO_WRAP);
                if (data.length < 16 || data.length > MAX_PHOTO_BYTES + 4096) throw new Exception("Vault file is too large.");
                names.add(name);
                blobs.add(data);
            }
            for (int i = 0; i < names.size(); i++) {
                File temp = new File(vaultDir(), names.get(i) + ".tmp");
                try (FileOutputStream out = new FileOutputStream(temp)) {
                    out.write(blobs.get(i));
                    out.getFD().sync();
                }
                temps.add(temp);
            }
            for (int i = 0; i < names.size(); i++) {
                File target = new File(vaultDir(), names.get(i));
                if (!temps.get(i).renameTo(target)) throw new Exception("Could not restore vault file.");
                imported++;
            }
            JSObject result = status();
            result.put("imported", imported);
            call.resolve(result);
        } catch (Exception e) {
            for (File temp : temps) if (temp.exists()) temp.delete();
            call.reject("Could not restore the encrypted photos.");
        }
    }

    private File safeFile(String name) {
        if (name == null || !SAFE_NAME.matcher(name).matches()) return null;
        File file = new File(vaultDir(), name);
        try {
            if (!file.getCanonicalPath().startsWith(vaultDir().getCanonicalPath() + File.separator)) return null;
        } catch (Exception e) {
            return null;
        }
        return file;
    }

    private static byte[] readAll(File file) throws Exception {
        try (FileInputStream in = new FileInputStream(file); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) out.write(buffer, 0, read);
            return out.toByteArray();
        }
    }

    private static void deleteTree(File file) {
        if (file == null || !file.exists()) return;
        File[] children = file.listFiles();
        if (children != null) for (File child : children) deleteTree(child);
        file.delete();
    }

}
