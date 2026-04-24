import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const LOGO_SVG = `data:image/svg+xml,%3Csvg width='600' height='240' viewBox='0 0 600 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2301241c'/%3E%3Cstop offset='100%25' stop-color='%23064e3b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='240' rx='30' fill='url(%23g)'/%3E%3C!-- SAVVY Text --%3E%3Ctext x='300' y='140' text-anchor='middle' font-family='serif' font-weight='900' font-size='160' fill='white'%3ESAVVY%3C/text%3E%3C!-- Integrated Coin on S --%3E%3Ccircle cx='115' cy='75' r='28' fill='white'/%3E%3Ccircle cx='115' cy='75' r='24' fill='none' stroke='%2301241c' stroke-width='2'/%3E%3Ctext x='115' y='85' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='32' fill='%2301241c'%3E$%3C/text%3E%3C!-- Integrated Arrow on Y --%3E%3Cpath d='M470 115 L495 90 L510 105 L540 70 M540 70 L515 70 M540 70 L540 95' stroke='white' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C!-- Subtitle --%3E%3Ctext x='300' y='210' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='35' letter-spacing='35' fill='white' opacity='0.9'%3EFINANCE%3C/text%3E%3C/svg%3E`;

interface BrandLogoProps {
  style?: StyleProp<ImageStyle>;
}

export const BrandLogo = ({ style }: BrandLogoProps) => {
  return (
    <Image 
      source={{ uri: LOGO_SVG }} 
      style={[{ width: 200, height: 80 }, style]} 
      resizeMode="contain" 
    />
  );
};
