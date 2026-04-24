import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const LOGO_SVG = `data:image/svg+xml,%3Csvg width='600' height='240' viewBox='0 0 600 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2301241c'/%3E%3Cstop offset='100%25' stop-color='%23064e3b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='240' rx='30' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='80' r='35' fill='white'/%3E%3Ctext x='100' y='92' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='45' fill='%2301241c'%3E$%3C/text%3E%3Ctext x='325' y='140' text-anchor='middle' font-family='serif' font-weight='900' font-size='160' fill='white'%3ESAVVY%3C/text%3E%3Ctext x='325' y='205' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='35' letter-spacing='35' fill='white' opacity='0.8'%3EFINANCE%3C/text%3E%3C/svg%3E`;

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
