"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeartButton from "../heart-button";
import { Avatar } from "../ui/avatar";
import SaveButton from "../save-button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const ArtistCard = ({
  data,
  currentUser,
  className,
  imagePriority = false,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/tatuadores/profile/${data.id}`)}
      onMouseEnter={() => {
        router.prefetch(`/tatuadores/profile/654e02287ffff1cdf25b7d92`);
      }}
      className={cn(
        `group isolate flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border shadow-sm
        transition-shadow ease-in-out hover:shadow-lg
        `,
        className,
      )}
    >
      <div className="relative">
        <div className="absolute right-3 top-3 z-[3]">
          <HeartButton
            listingId={data.id}
            currentUser={currentUser}
            listingType="artists"
          />
        </div>

        <div className="absolute left-3 top-3 z-[3]">
          <SaveButton
            listingId={data.id}
            currentUser={currentUser}
            listingType="artists"
          />
        </div>

        <div className="aspect-square overflow-hidden">
          <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
            <div className="relative inset-0 aspect-square overflow-hidden transition-transform">
              <Image
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                fill={true}
                //TODO:  What about when there is not image??
                src={
                  data?.images[0] || data.mainImage || "/images/placeholder.png"
                }
                alt="profile picture"
                priority={imagePriority}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-6 px-5 py-3">
        {/* <Avatar user={data} /> */}
        <p className="truncate">{data.artisticName}</p>
        {data.userId ? (
          <Badge className={"bg-primary/60"}>Verificado</Badge>
        ) : null}
      </div>
      {/* <div className="px-5 py-3">
                €€€
            </div> */}
    </div>
  );
};
export default ArtistCard;
