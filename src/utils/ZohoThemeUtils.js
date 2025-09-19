// src/utils/ZohoThemeUtils.js
import { Platform } from 'react-native';
import { ZohoSalesIQ } from 'react-native-zohosalesiq-mobilisten';

class ZohoThemeUtils {
  // App color scheme
  static colors = {
    primary: '#7E5BEF',
    secondary: '#1a1a2e',
    white: '#FFFFFF',
    text: '#333333',
    lightGray: '#F5F5F5',
  };

  // Apply complete theming
  static applyTheme() {
    try {
      console.log("Applying comprehensive Zoho SalesIQ theming...");

      this.setPrimaryColors();
      this.configureChatAppearance();
      this.configureLauncher();
      this.configureFormSettings();

      console.log("Zoho SalesIQ theming applied successfully");
    } catch (error) {
      console.error("Error applying Zoho theming:", error);
    }
  }

  // Set primary theme colors
  static setPrimaryColors() {
    try {
      // Primary color for both platforms
      ZohoSalesIQ.Theme.setPrimaryColor(this.colors.primary);

      // Secondary color
      ZohoSalesIQ.Theme.setSecondaryColor(this.colors.secondary);

      console.log("Primary colors set successfully");
    } catch (error) {
      console.log("Primary color setting error:", error);
    }
  }

  // Configure chat window appearance
  static configureChatAppearance() {
    try {
      // Chat bubble styling
      ZohoSalesIQ.Chat.setBubbleBackgroundColor(this.colors.primary);
      ZohoSalesIQ.Chat.setBubbleTextColor(this.colors.white);

      // Navigation bar styling
      ZohoSalesIQ.Chat.setNavigationBarBackgroundColor(this.colors.primary);
      ZohoSalesIQ.Chat.setNavigationBarTextColor(this.colors.white);

      // Chat window background
      ZohoSalesIQ.Chat.setBackgroundColor(this.colors.white);

      console.log("Chat appearance configured successfully");
    } catch (error) {
      console.log("Chat appearance configuration error:", error);
    }
  }

  // Configure launcher settings
  static configureLauncher() {
    try {
      // Hide launcher by default (as requested in original code)
      ZohoSalesIQ.Launcher.show(ZohoSalesIQ.Launcher.VisibilityMode.NEVER);

      // If you want to show launcher later, you can use:
      // ZohoSalesIQ.Launcher.show(ZohoSalesIQ.Launcher.VisibilityMode.ALWAYS);

      console.log("Launcher configured successfully");
    } catch (error) {
      console.log("Launcher configuration error:", error);
    }
  }

  // Configure form and visibility settings
  static configureFormSettings() {
    try {
      // Pre-chat form settings
      ZohoSalesIQ.Chat.setVisitorNameVisibility(true);
      ZohoSalesIQ.Chat.setQuestionVisibility(true);
      ZohoSalesIQ.Chat.setPhoneNumberVisibility(false);

      // Post-chat settings
      ZohoSalesIQ.Chat.setFeedbackVisibility(true);
      ZohoSalesIQ.Chat.setRatingVisibility(true);

      // Offline form
      ZohoSalesIQ.Chat.setOfflineMessageVisibility(true);

      console.log("Form settings configured successfully");
    } catch (error) {
      console.log("Form settings configuration error:", error);
    }
  }

  // Show chat programmatically with theming
  static showChat() {
    try {
      ZohoSalesIQ.Chat.show();
    } catch (error) {
      console.log("Error showing chat:", error);
    }
  }

  // Show chat with specific department
  static showChatWithDepartment(departmentName) {
    try {
      ZohoSalesIQ.Chat.showWithDepartmentName(departmentName);
    } catch (error) {
      console.log("Error showing chat with department:", error);
    }
  }

  // Set visitor information
  static setVisitorInfo(name, email, phone = null) {
    try {
      if (name) ZohoSalesIQ.Visitor.setName(name);
      if (email) ZohoSalesIQ.Visitor.setEmail(email);
      if (phone) ZohoSalesIQ.Visitor.setContactNumber(phone);

      console.log("Visitor info set successfully");
    } catch (error) {
      console.log("Error setting visitor info:", error);
    }
  }

  // Set custom visitor variables
  static setVisitorCustomInfo(key, value) {
    try {
      ZohoSalesIQ.Visitor.setCustomInfo(key, value);
    } catch (error) {
      console.log("Error setting custom visitor info:", error);
    }
  }

  // Apply dark theme variant
  static applyDarkTheme() {
    const darkColors = {
      primary: '#BB86FC',
      secondary: '#121212',
      white: '#FFFFFF',
      text: '#E0E0E0',
      background: '#1E1E1E',
    };

    try {
      ZohoSalesIQ.Theme.setPrimaryColor(darkColors.primary);
      ZohoSalesIQ.Theme.setSecondaryColor(darkColors.secondary);
      ZohoSalesIQ.Chat.setBackgroundColor(darkColors.background);

      console.log("Dark theme applied successfully");
    } catch (error) {
      console.log("Error applying dark theme:", error);
    }
  }

  // Apply light theme variant
  static applyLightTheme() {
    try {
      this.applyTheme(); // Use default light theme
    } catch (error) {
      console.log("Error applying light theme:", error);
    }
  }
}

export default ZohoThemeUtils;