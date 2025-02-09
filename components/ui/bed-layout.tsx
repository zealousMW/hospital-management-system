import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Bed {
  bed_id: number;
  bed_number: string;
  is_occupied: boolean;
}

interface BedLayoutProps {
  beds: Bed[];
  selectedBed: string | null;
  onSelectBed: (bedId: string) => void;
}

export function BedLayout({ beds, selectedBed, onSelectBed }: BedLayoutProps) {
  const gridColumns = 4; // Adjust this based on your ward layout preferences

  return (
    <div className="p-4 border rounded-lg">
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded bg-white"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded bg-gray-300"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded bg-blue-500"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      <div 
        className="grid gap-4" 
        style={{ 
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)` 
        }}
      >
        {beds.map((bed) => (
          <Popover key={bed.bed_id}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (!bed.is_occupied) {
                    onSelectBed(bed.bed_id.toString());
                  }
                }}
                disabled={bed.is_occupied}
                className={cn(
                  "w-full p-2 border rounded-lg text-center transition-colors",
                  "hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  bed.is_occupied && "bg-gray-300 cursor-not-allowed",
                  selectedBed === bed.bed_id.toString() && "bg-blue-500 text-white",
                  !bed.is_occupied && !selectedBed && "bg-white"
                )}
              >
                <div className="text-xs font-semibold">Bed</div>
                <div className="text-sm">{bed.bed_number}</div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <div className="font-medium">Bed Information</div>
                <div className="text-sm">
                  <p>Bed Number: {bed.bed_number}</p>
                  <p>Status: {bed.is_occupied ? 'Occupied' : 'Available'}</p>
                  {selectedBed === bed.bed_id.toString() && (
                    <p className="text-blue-500">Currently Selected</p>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
