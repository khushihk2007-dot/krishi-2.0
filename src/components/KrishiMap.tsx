import { useEffect, useMemo, useState } from "react";
import { DivIcon } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { getRegionContent, Language, RegionId, regionEntries } from "@/data/krishiMysuru";

type KrishiMapProps = {
  selectedId: RegionId;
  language: Language;
  onSelect: (id: RegionId) => void;
};

function FocusRegion({ selectedId }: { selectedId: RegionId }) {
  const map = useMap();
  const [, region] = regionEntries.find(([id]) => id === selectedId) ?? regionEntries[0];

  useEffect(() => {
    map.flyTo([region.lat, region.lng], selectedId === "gokulam" ? 12 : 11, { duration: 1.1, easeLinearity: 0.25 });
  }, [map, region.lat, region.lng, selectedId]);

  return null;
}

function makePin(color: string, active: boolean) {
  return new DivIcon({
    className: "",
    html: `<div class="krishi-pin" style="background:${color};width:${active ? 30 : 24}px;height:${active ? 30 : 24}px"></div>`,
    iconSize: [active ? 30 : 24, active ? 30 : 24],
    iconAnchor: [active ? 15 : 12, active ? 15 : 12],
  });
}

export function KrishiMap({ selectedId, language, onSelect }: KrishiMapProps) {
  const [isLoadingTiles, setIsLoadingTiles] = useState(true);
  const markers = useMemo(
    () =>
      regionEntries.map(([id, region]) => ({
        id,
        region,
        icon: makePin(region.color, id === selectedId),
      })),
    [selectedId],
  );

  useEffect(() => {
    if (!isLoadingTiles) return;

    const timeout = window.setTimeout(() => {
      setIsLoadingTiles(false);
    }, 9000);

    return () => window.clearTimeout(timeout);
  }, [isLoadingTiles]);

  return (
    <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-background">
      <MapContainer center={[12.32, 76.62]} zoom={10} minZoom={8} maxZoom={15} zoomControl className="absolute inset-0 z-0 h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          eventHandlers={{
            loading: () => {
              setIsLoadingTiles(true);
            },
            load: () => {
              setIsLoadingTiles(false);
            },
            tileerror: () => {
              setIsLoadingTiles(false);
            },
          }}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FocusRegion selectedId={selectedId} />
        {markers.map(({ id, region, icon }) => (
          <Marker key={id} position={[region.lat, region.lng]} icon={icon} eventHandlers={{ click: () => onSelect(id) }}>
            <Tooltip direction="top" offset={[0, -14]} opacity={0.95}>
              {getRegionContent(region, id, language).name} · pH {region.ph.toFixed(1)}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {isLoadingTiles && (
        <div className="pointer-events-none absolute inset-0 z-[700] flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="rounded-lg border border-glass-border bg-glass/92 px-5 py-4 text-center text-glass-foreground shadow-glass">
            <div className="mx-auto mb-3 size-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-bold">Loading Mysuru map…</p>
          </div>
        </div>
      )}

    </div>
  );
}
