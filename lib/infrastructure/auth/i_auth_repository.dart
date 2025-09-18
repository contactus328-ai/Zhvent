import '../../domain/auth/auth_repository.dart';

class IAuthRepository extends AuthRepository {
  final String appUrl;
  IAuthRepository({required this.appUrl});

}