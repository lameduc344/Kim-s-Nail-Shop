export type PosAppointmentPayload = { appointmentId:string; customerName:string; serviceName:string; totalCents:number; status:string };
export interface PosProvider { name:string; pushAppointment(payload:PosAppointmentPayload):Promise<{externalId?:string}>; updateAppointment(payload:PosAppointmentPayload):Promise<void>; }
export class NoopPosProvider implements PosProvider { name="none"; async pushAppointment(){return {};} async updateAppointment(){return;} }
export function getPosProvider():PosProvider { return new NoopPosProvider(); }
