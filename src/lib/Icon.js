import React from 'react'
import { SvgUri } from 'react-native-svg';

export default function Icon({ name, width, height }) {
  return (
    <SvgUri
      width={width}
      height={height}
      uri={`https://cdn.jsdelivr.net/gh/Parthiban1612/trundle-iocns@main/icons/${name}.svg`}
    />

  )
}
