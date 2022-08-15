package com.arash.altafi.socketio3.activities;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import com.arash.altafi.R;

public class LicenseActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_license);

        findViewById(R.id.licenseBack).setOnClickListener(view -> onBackPressed());
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }
}