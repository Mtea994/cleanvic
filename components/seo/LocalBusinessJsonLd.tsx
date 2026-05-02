import {
  address,
  businessGeo,
  businessName,
  phone,
  serviceArea,
  siteUrl,
} from "@/lib/config/site";
import { shouldEmitAddress } from "@/lib/seo/address-gate";
import { buildLocalBusinessSchema } from "@/lib/seo/jsonld";
import { getReviewStats } from "@/lib/reviews/getReviewStats";

export async function LocalBusinessJsonLd() {
  const aggregateRating = await getReviewStats();
  const addressEligible = shouldEmitAddress(address);

  const schema = buildLocalBusinessSchema({
    name: businessName,
    url: siteUrl,
    telephone: phone,
    serviceArea,
    geo: businessGeo,
    address: addressEligible ? address : null,
    aggregateRating,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
