import { Download } from 'lucide-react';
import { getPressAssetUrl, type PressMediaAsset } from '../../data/pressReleases';
import { Button } from '../ui/button';

interface MediaAssetCardProps {
  asset: PressMediaAsset;
}

export function MediaAssetCard({ asset }: MediaAssetCardProps) {
  const assetUrl = getPressAssetUrl(asset);
  const fileName = asset.src.split('/').pop() ?? `${asset.id}.webp`;

  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex min-h-64 items-center justify-center bg-[#F7F4EF] p-5">
        <img
          src={assetUrl}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading="lazy"
          className="max-h-[27rem] w-full object-contain"
        />
      </div>
      <figcaption className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold leading-snug text-[#1A1A1A]">{asset.title}</h3>
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-gray-400">
            {asset.fileType}
          </span>
        </div>
        <p className="text-sm leading-6 text-gray-600">{asset.caption}</p>
        {asset.credit ? <p className="mt-3 text-sm font-semibold text-gray-700">Credit: {asset.credit}</p> : null}
        {asset.usageNote ? (
          <p
            className={
              asset.conceptualRendering
                ? 'mt-4 rounded-xl border border-[#FDB515]/40 bg-[#FFF9E8] p-4 text-sm leading-6 text-gray-700'
                : 'mt-4 text-sm leading-6 text-gray-500'
            }
          >
            {asset.usageNote}
          </p>
        ) : null}
        <Button asChild variant="outline" className="mt-6 w-full sm:w-fit">
          <a href={assetUrl} download={fileName}>
            <Download aria-hidden="true" /> Download image
          </a>
        </Button>
      </figcaption>
    </figure>
  );
}
