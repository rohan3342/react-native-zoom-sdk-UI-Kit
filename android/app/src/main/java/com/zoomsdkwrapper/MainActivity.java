package com.zoomsdkwrapper;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import us.zoom.sdk.ZoomVideoSDK;
import us.zoom.sdk.ZoomVideoSDKShareHelper;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "zoomSdkWrapper";
  }

  /**
   *  Users need to add below to their own project to use sharing.
   */
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data){
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == 0 && resultCode == Activity.RESULT_OK) {
      Intent intent = new Intent(this, NotificationService.class);
      ZoomVideoSDKShareHelper shareHelper = ZoomVideoSDK.getInstance().getShareHelper();
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        startForegroundService(intent);
      } else {
        startService(intent);
      }
      shareHelper.startShareScreen(data);
    }
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }
}
