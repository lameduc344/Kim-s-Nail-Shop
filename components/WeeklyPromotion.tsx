import { weeklyPromotion } from "@/data/promotion";

export function WeeklyPromotion() {
  return <aside className="weekly-promotion"><p className="eyebrow">{weeklyPromotion.eyebrow}</p><div><h2>{weeklyPromotion.title}</h2><p>{weeklyPromotion.description}</p></div><div className="promotion-code"><span>Use code</span><b>{weeklyPromotion.code}</b></div><small>{weeklyPromotion.terms}</small></aside>;
}
