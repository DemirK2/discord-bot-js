export async function handleEventError(
  eventName: string,
  error: unknown
): Promise<void> {
  console.error(`Event error (${eventName}):`, error);
}
