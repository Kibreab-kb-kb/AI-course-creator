import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface InfoCardProps {
  number: string | number;
  description: string;
  header: string;
  icon: React.ReactNode;

  loading?: boolean;
}
const InfoCard: React.FC<InfoCardProps> = ({
  number,
  icon,
  header,
  description,
  loading,
}) => {
  return (
    <Card className="h-full max-h-48 hover:shadow hover:border-gray-300 transition-all duration-150">
      <CardContent className="w-full h-full px-8 py-6">
        {!loading ? (
          <div className="flex flex-col h-full justify-between gap-4 ">
            <div className="pb-1 text-gray-600 flex justify-between items-center">
              <span>{header}</span>
              <span className="text-neutral-400">{icon}</span>
            </div>
            <span className="text-5xl font-medium text-gray-800">{number}</span>
            <span className="text-sm text-gray-400">{description}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-1/3 h-20" />
            <Skeleton className="w-full h-6" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
