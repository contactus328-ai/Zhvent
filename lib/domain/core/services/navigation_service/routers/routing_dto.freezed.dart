// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'routing_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

RoutingDto _$RoutingDtoFromJson(Map<String, dynamic> json) {
  return _RoutingDto.fromJson(json);
}

/// @nodoc
mixin _$RoutingDto {
  String get route => throw _privateConstructorUsedError;
  Map<String, String> get queryParameters => throw _privateConstructorUsedError;

  /// Serializes this RoutingDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RoutingDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RoutingDtoCopyWith<RoutingDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RoutingDtoCopyWith<$Res> {
  factory $RoutingDtoCopyWith(
          RoutingDto value, $Res Function(RoutingDto) then) =
      _$RoutingDtoCopyWithImpl<$Res, RoutingDto>;
  @useResult
  $Res call({String route, Map<String, String> queryParameters});
}

/// @nodoc
class _$RoutingDtoCopyWithImpl<$Res, $Val extends RoutingDto>
    implements $RoutingDtoCopyWith<$Res> {
  _$RoutingDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RoutingDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? route = null,
    Object? queryParameters = null,
  }) {
    return _then(_value.copyWith(
      route: null == route
          ? _value.route
          : route // ignore: cast_nullable_to_non_nullable
              as String,
      queryParameters: null == queryParameters
          ? _value.queryParameters
          : queryParameters // ignore: cast_nullable_to_non_nullable
              as Map<String, String>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RoutingDtoImplCopyWith<$Res>
    implements $RoutingDtoCopyWith<$Res> {
  factory _$$RoutingDtoImplCopyWith(
          _$RoutingDtoImpl value, $Res Function(_$RoutingDtoImpl) then) =
      __$$RoutingDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String route, Map<String, String> queryParameters});
}

/// @nodoc
class __$$RoutingDtoImplCopyWithImpl<$Res>
    extends _$RoutingDtoCopyWithImpl<$Res, _$RoutingDtoImpl>
    implements _$$RoutingDtoImplCopyWith<$Res> {
  __$$RoutingDtoImplCopyWithImpl(
      _$RoutingDtoImpl _value, $Res Function(_$RoutingDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of RoutingDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? route = null,
    Object? queryParameters = null,
  }) {
    return _then(_$RoutingDtoImpl(
      route: null == route
          ? _value.route
          : route // ignore: cast_nullable_to_non_nullable
              as String,
      queryParameters: null == queryParameters
          ? _value._queryParameters
          : queryParameters // ignore: cast_nullable_to_non_nullable
              as Map<String, String>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RoutingDtoImpl implements _RoutingDto {
  _$RoutingDtoImpl(
      {required this.route, required final Map<String, String> queryParameters})
      : _queryParameters = queryParameters;

  factory _$RoutingDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$RoutingDtoImplFromJson(json);

  @override
  final String route;
  final Map<String, String> _queryParameters;
  @override
  Map<String, String> get queryParameters {
    if (_queryParameters is EqualUnmodifiableMapView) return _queryParameters;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_queryParameters);
  }

  @override
  String toString() {
    return 'RoutingDto(route: $route, queryParameters: $queryParameters)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RoutingDtoImpl &&
            (identical(other.route, route) || other.route == route) &&
            const DeepCollectionEquality()
                .equals(other._queryParameters, _queryParameters));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, route,
      const DeepCollectionEquality().hash(_queryParameters));

  /// Create a copy of RoutingDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RoutingDtoImplCopyWith<_$RoutingDtoImpl> get copyWith =>
      __$$RoutingDtoImplCopyWithImpl<_$RoutingDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RoutingDtoImplToJson(
      this,
    );
  }
}

abstract class _RoutingDto implements RoutingDto {
  factory _RoutingDto(
      {required final String route,
      required final Map<String, String> queryParameters}) = _$RoutingDtoImpl;

  factory _RoutingDto.fromJson(Map<String, dynamic> json) =
      _$RoutingDtoImpl.fromJson;

  @override
  String get route;
  @override
  Map<String, String> get queryParameters;

  /// Create a copy of RoutingDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RoutingDtoImplCopyWith<_$RoutingDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
