import { BookOpen, GraduationCap, Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const LearningMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
          size="icon"
        >
          <GraduationCap className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Oppimiskeskus</SheetTitle>
          <SheetDescription>
            Paranna kaupankäyntitietojasi kurateoiduilla resursseilla.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4 p-4 hover:bg-accent rounded-lg cursor-pointer">
            <BookOpen className="h-6 w-6" />
            <div>
              <h3 className="font-medium">Markkinoiden perusteet</h3>
              <p className="text-sm text-muted-foreground">Opi osakekaupan perusteet</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-accent rounded-lg cursor-pointer">
            <Info className="h-6 w-6" />
            <div>
              <h3 className="font-medium">Tekninen analyysi</h3>
              <p className="text-sm text-muted-foreground">Hallitse kuvioanalyysi ja indikaattorit</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-accent rounded-lg cursor-pointer">
            <GraduationCap className="h-6 w-6" />
            <div>
              <h3 className="font-medium">Kaupankäyntistrategiat</h3>
              <p className="text-sm text-muted-foreground">Edistyneet kaupankäyntitekniikat ja vinkit</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LearningMenu;