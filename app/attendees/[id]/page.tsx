import { prisma } from "@/lib/prisma";
import QRCodeDisplay from "./QRCodeDisplay";

export default async function AttendeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const attendee = await prisma.attendee.findUnique({ where: { id } });

  if (!attendee) {
    return <p className="p-6">Attendee not found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl font-semibold">{attendee.name}</h1>
      <p>{attendee.email}</p>
      <QRCodeDisplay value={attendee.qrCode} />
    </div>
  );
}