package com.harsha.form;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

@CapacitorPlugin(name = "Backup")
public class BackupPlugin extends Plugin {
    private static final byte[] MAGIC = "FORMBAK1".getBytes(StandardCharsets.US_ASCII);
    private static final int ITERATIONS = 600000;
    private static final int KEY_BITS = 256;
    private static final int SALT_BYTES = 16;
    private static final int IV_BYTES = 12;
    private static final int TAG_BITS = 128;
    private static final int MAX_BACKUP_BYTES = 64 * 1024 * 1024;

    private String pendingData;
    private String pendingPassword;

    @PluginMethod
    public void exportBackup(PluginCall call) {
        String data = call.getString("data", "");
        String password = call.getString("password", "");
        String fileName = call.getString("fileName", "FORM-backup.formbak");
        if (data.isEmpty() || password.length() < 8) {
            call.reject("Backup data and a password of at least 8 characters are required.");
            return;
        }
        if (data.getBytes(StandardCharsets.UTF_8).length > MAX_BACKUP_BYTES) {
            call.reject("Backup data is too large.");
            return;
        }
        pendingData = data;
        pendingPassword = password;
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/octet-stream");
        intent.putExtra(Intent.EXTRA_TITLE, fileName);
        startActivityForResult(call, intent, "exportResult");
    }

    @ActivityCallback
    private void exportResult(PluginCall call, ActivityResult result) {
        String data = pendingData;
        String password = pendingPassword;
        pendingData = null;
        pendingPassword = null;
        if (call == null) return;
        if (data == null || password == null) {
            call.reject("Backup was cancelled.");
            return;
        }
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Backup was cancelled.");
            return;
        }
        try {
            byte[] encrypted = encrypt(data.getBytes(StandardCharsets.UTF_8), password);
            try (OutputStream out = getContext().getContentResolver().openOutputStream(result.getData().getData())) {
                if (out == null) throw new Exception("Could not open the selected file.");
                out.write(encrypted);
                out.flush();
            }
            JSObject response = new JSObject();
            response.put("ok", true);
            response.put("bytes", encrypted.length);
            call.resolve(response);
        } catch (Exception e) {
            call.reject("Could not write the encrypted backup.");
        }
    }

    @PluginMethod
    public void importBackup(PluginCall call) {
        pendingPassword = call.getString("password", "");
        if (pendingPassword.length() < 8) {
            pendingPassword = null;
            call.reject("Enter the backup password.");
            return;
        }
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        startActivityForResult(call, intent, "importResult");
    }

    @ActivityCallback
    private void importResult(PluginCall call, ActivityResult result) {
        String password = pendingPassword;
        pendingPassword = null;
        if (call == null) return;
        if (password == null) {
            call.reject("Backup was cancelled.");
            return;
        }
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Backup was cancelled.");
            return;
        }
        try {
            Uri uri = result.getData().getData();
            byte[] encrypted;
            try (InputStream in = getContext().getContentResolver().openInputStream(uri)) {
                if (in == null) throw new Exception("Could not open the selected file.");
                encrypted = readAll(in);
            }
            if (encrypted.length > MAX_BACKUP_BYTES) throw new Exception("Backup is too large.");
            String json = new String(decrypt(encrypted, password), StandardCharsets.UTF_8);
            JSObject response = new JSObject();
            response.put("ok", true);
            response.put("data", json);
            call.resolve(response);
        } catch (Exception e) {
            call.reject("Could not decrypt the backup. Check the password and file.");
        }
    }

    private static byte[] encrypt(byte[] plain, String password) throws Exception {
        byte[] salt = new byte[SALT_BYTES];
        byte[] iv = new byte[IV_BYTES];
        SecureRandom random = new SecureRandom();
        random.nextBytes(salt);
        random.nextBytes(iv);
        SecretKey key = derive(password, salt);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(TAG_BITS, iv));
        byte[] body = cipher.doFinal(plain);
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        DataOutputStream out = new DataOutputStream(bytes);
        out.write(MAGIC);
        out.writeInt(salt.length);
        out.write(salt);
        out.writeInt(iv.length);
        out.write(iv);
        out.write(body);
        out.flush();
        return bytes.toByteArray();
    }

    private static byte[] decrypt(byte[] data, String password) throws Exception {
        DataInputStream in = new DataInputStream(new java.io.ByteArrayInputStream(data));
        byte[] magic = new byte[MAGIC.length];
        in.readFully(magic);
        if (!Arrays.equals(magic, MAGIC)) throw new Exception("Not a FORM backup.");
        int saltLength = in.readInt();
        if (saltLength < 8 || saltLength > 64) throw new Exception("Invalid salt.");
        byte[] salt = new byte[saltLength];
        in.readFully(salt);
        int ivLength = in.readInt();
        if (ivLength < 12 || ivLength > 32) throw new Exception("Invalid nonce.");
        byte[] iv = new byte[ivLength];
        in.readFully(iv);
        ByteArrayOutputStream body = new ByteArrayOutputStream();
        byte[] buffer = new byte[8192];
        int read;
        while ((read = in.read(buffer)) != -1) body.write(buffer, 0, read);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, derive(password, salt), new GCMParameterSpec(TAG_BITS, iv));
        return cipher.doFinal(body.toByteArray());
    }

    private static SecretKey derive(String password, byte[] salt) throws Exception {
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

    private static byte[] readAll(InputStream in) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buffer = new byte[8192];
        int read;
        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
            if (out.size() > MAX_BACKUP_BYTES) throw new Exception("Backup is too large.");
        }
        return out.toByteArray();
    }
}
