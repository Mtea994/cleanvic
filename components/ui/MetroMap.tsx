import Image from "next/image";

interface PinSpec {
  top: string;
  left: string;
  size?: number;
  opacity?: number;
  label?: string;
}

const pins: PinSpec[] = [
  { top: "38%", left: "47%", label: "CBD" },
  { top: "42%", left: "55%", size: 8, opacity: 0.6 },
  { top: "34%", left: "42%", size: 8, opacity: 0.5 },
  { top: "50%", left: "35%", size: 8, opacity: 0.5 },
  { top: "28%", left: "60%", size: 8, opacity: 0.4 },
  { top: "62%", left: "58%", size: 8, opacity: 0.4 },
  { top: "20%", left: "50%", size: 6, opacity: 0.3 },
  { top: "70%", left: "45%", size: 6, opacity: 0.3 },
  { top: "44%", left: "28%", size: 6, opacity: 0.3 },
];

export function MetroMap({ caption }: { caption?: string }) {
  return (
    <div
      className="loc-hero-map"
      role="img"
      aria-label="Melbourne metro coverage map"
    >
      <div className="map-visual">
        <Image
          src="/images/melbourne-coverage-map.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 0px, 50vw"
          style={{ objectFit: "cover", opacity: 0.85 }}
        />

        {pins.map((pin, i) => (
          <div
            key={i}
            className="map-pin-wrap"
            style={{ top: pin.top, left: pin.left }}
          >
            <div
              className="map-pin"
              style={
                pin.size
                  ? {
                      width: pin.size,
                      height: pin.size,
                      background: `rgba(78,146,218,${pin.opacity ?? 0.6})`,
                    }
                  : undefined
              }
            />
            {pin.label && <div className="map-pin-label">{pin.label}</div>}
          </div>
        ))}

        {caption && (
          <div
            className="photo-placeholder-label"
            style={{ bottom: 16, left: "50%", transform: "translateX(-50%)" }}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
