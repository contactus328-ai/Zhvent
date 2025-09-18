// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'routing_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RoutingDtoImpl _$$RoutingDtoImplFromJson(Map<String, dynamic> json) =>
    _$RoutingDtoImpl(
      route: json['route'] as String,
      queryParameters: Map<String, String>.from(json['queryParameters'] as Map),
    );

Map<String, dynamic> _$$RoutingDtoImplToJson(_$RoutingDtoImpl instance) =>
    <String, dynamic>{
      'route': instance.route,
      'queryParameters': instance.queryParameters,
    };
