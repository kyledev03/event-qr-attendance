"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRCodeDisplay({ value }: { value: string }) {
  return <QRCodeSVG value={value} size={200} />;
}