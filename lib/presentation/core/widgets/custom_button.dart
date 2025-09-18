import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import 'package:responsive_sizer/responsive_sizer.dart';

class CustomButton extends StatelessWidget {
  const CustomButton({
    super.key,
    required this.text,
    required this.function,
    this.textFontWeight,
    this.width,
    this.height,
    this.borderRadius,
    this.borderColor,
    this.backgroundColor,
    this.textColor,
    this.widget,
    this.textFontSize,
    this.textStyle,
    this.isDisabled = false,
  });
  final double? width, height, borderRadius;
  final Color? borderColor, backgroundColor, textColor;
  final String text;
  final Function function;
  final FontWeight? textFontWeight;
  final double? textFontSize;
  final TextStyle? textStyle;
  final bool isDisabled;
  final Widget? widget;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      style: TextButton.styleFrom(
        minimumSize: Size(width ?? 100.w, height ?? 7.h),
        backgroundColor:
            isDisabled
                ? const Color(0xFFD1D5DB)
                : backgroundColor ?? Theme.of(context).primaryColor,
        side: BorderSide(
          color:
              isDisabled
                  ? const Color(0xFFD1D5DB)
                  : borderColor ?? Theme.of(context).primaryColor,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius ?? 12.px),
        ),
      ),
      onPressed: () => function(),
      child:
        Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (widget != null) widget!,
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      text,
                      style:
                          textStyle ??
                          Theme.of(context).textTheme.bodySmall!.copyWith(
                            color: textColor ?? Colors.white,
                            fontSize: textFontSize ?? 16.sp,
                            fontWeight: textFontWeight ?? FontWeight.w500,
                          ),
                    ),
                  ),
                ],
              ),
    );
  }
}

class CustomIconButton extends StatelessWidget {
  const CustomIconButton({
    super.key,
    required this.onTap,
    required this.assetName,
    required this.text,
    this.backgroundColor,
    this.padding,
    this.textStyle,
  });
  final Function() onTap;
  final String text;
  final Color? backgroundColor;
  final String assetName;
  final EdgeInsetsGeometry? padding;
  final TextStyle? textStyle;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding:
            padding ?? EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.w),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8.px),
          color: backgroundColor ?? Theme.of(context).colorScheme.secondary,
        ),
        child: Row(
          children: [
            SvgPicture.asset(assetName),
            SizedBox(width: 2.w),
            Text(
              text,
              style:
                  textStyle ??
                  Theme.of(context).textTheme.bodySmall!.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.tertiary,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
