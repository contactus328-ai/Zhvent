class APIConstants {
  static String agentModule = 'agent';
  static String getAgentByBadge = '$agentModule/fetch/badgeNumber';
  static String getLoggedAgent = '$agentModule/me';
  static String updateStatus = '$agentModule/update/status';
  static String getNearByAlerts = '$agentModule/nearBy/alertRequest';
  static String updateAgentLocation = '$agentModule/update/location';
  static String getAlertDetailsById = '$agentModule/alert/byId';
  static String updateAlertStatus = '$agentModule/alertRequest/status/update';
  static String updateDenyBackup = '$agentModule/request/denyBackup';
  static String provideBackup = '$agentModule/provide/backup';
  static String getNearByAgents = '$agentModule/nearBy/agents';
  static String addFcmToken = '$agentModule/add/fcmToken';
  static String removeFcmToken = '$agentModule/remove/fcmToken';
  static String uploadProfilePic = '$agentModule/upload/profilePhoto';
  static String updateProfilePic = '$agentModule/update/profilePhoto';
  static String getActivityLogs = '$agentModule/log/history';
  static String getActivityDetailsById = '$agentModule/activity';

}

class CommonApiConstants {
  static const String common = 'common';
  static const String getFileSignedUrl = '$common/get-file-sign-url';
}