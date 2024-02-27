import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import YouTube from "react-youtube";

const projects: {
  name: string;
  description?: React.ReactNode;
  video?: string;
  image?: string;
  alt?: string;
  tags?: string[];
  link?: string;
  pushTag?: string;
  youtube?: boolean;
}[] = [
  {
    name: "UNFAMILIAR",
    description:
      "Unfamiliar is a relaxing fantasy adventure game where you take the form of a cat-witch who sets out to acquire magic ingredients from storybook worlds to craft items and create enchanting costumes.",
    video:
      "https://steamcdn-a.akamaihd.net/steam/apps/256763113/movie480.webm?t=1569734943",
    tags: ["Game", "Unity3D", "Steam"],
    pushTag: "Latest",
  },
  {
    name: "GOOGLESHEETS UNITY INTERGRATION",
    description:
      "GoogleSheets Unity Intergration is a tool I created during my time at ManaTea. The tool creates instances of objects from rows in a google sheet and pouplates the values of those objects with from colunms in the spreadsheet",
    image: "https://jezzalittle.github.io/img/GoogleSheets/GoogleSheets.gif",
    tags: ["Google Sheets", "Unity3D"],
  },
  {
    name: "DIVIDE",
    description:
      "Divide is a turn-based strategy game set in a cyberpunk dystopia whilst moving along a hex grid.",
    video: "https://youtu.be/nPl6idlNnsc",
    tags: ["Game", "Unity3D", "Steam"],
    pushTag: "Latest",
    youtube: true,
  },
  {
    name: "OPENGL ENGINE",
    description:
      "OpenGL Engine is the last C++ project made at AIE, it uses OpenGL to draw OBJ to the Screen.",
    image: "https://jezzalittle.github.io/img/OpenGL/OpenGL.gif",
    tags: ["C++", "GLSL"],
  },
];

function App() {
  const [selectedProject, setSelectedProject] = useState<number | null>(0);
  const [prevSelectedProject, setPrevSelectedProject] = useState<number | null>(
    null
  );

  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", (e) => {
      const slideNodes = e.slideNodes();
      let fullyVisibleSlideId: string | null = null;
      setPrevSelectedProject(selectedProject);
      slideNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const completelyVisible =
          rect.left >= 0 && rect.right <= window.innerWidth;

        if (completelyVisible) {
          fullyVisibleSlideId = node.id;

          const projectIndex = projects.findIndex(
            (project) => project.name === fullyVisibleSlideId
          );
          if (
            projectIndex !== -1 &&
            selectedProject !== projectIndex &&
            prevSelectedProject !== projectIndex
          ) {
            setSelectedProject(projectIndex);
          }
        }
      });

      if (fullyVisibleSlideId === null) {
        console.log("No fully visible slide found");
      }
    });
  }, [api, prevSelectedProject, selectedProject]);

  const videoRefs = useRef(new Map());

  // Initialize the Carousel API and other useEffect hooks

  // Effect to handle video playback based on selectedProject
  useEffect(() => {
    videoRefs.current.forEach((player, index) => {
      if (index === selectedProject) {
        if (projects[index].youtube) {
          player.playVideo(); // For YouTube videos
        } else {
          player.play(); // For regular video elements
        }
      } else {
        if (projects[index].youtube) {
          player.pauseVideo(); // For YouTube videos
        } else {
          player.pause(); // For regular video elements
        }
      }
    });
  }, [selectedProject, videoRefs]);
  return (
    <section className="flex flex-row h-screen w-screen max-w-full overflow-clip items-center">
      <div className="min-w-[30vw] flex flex-col shrink-0 pl-10 justify-between h-[30vw]">
        <div className="max-w-xs">
          <div className="flex space-x-4 items-center">
            <h2 className="text-6xl font-bold">Work</h2>
            <span className="rounded-full h-12 w-12 border flex items-center justify-center text-xl ">
              {projects.length}
            </span>
          </div>
          <p className="mt-4 text-lg">
            {selectedProject === null
              ? "A selection of our crafted work, built from scratch by our talented in-house team."
              : projects[selectedProject].description}
          </p>
        </div>
        <button className="px-6 py-3 rounded-full w-fit border hover:bg-gray-100 transition-colors">
          See All Work
        </button>
      </div>
      <div className="shrink-0 relative w-full h-full">
        <Carousel
          className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[40rem]"
          setApi={setApi}
          opts={{ loop: true, align: "start", slidesToScroll: 1 }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="">
            {projects.map((project, index) => (
              <CarouselItem
                id={project.name}
                key={`${project.name}-${index}`}
                className="rounded-xl aspect-square w-[45rem] max-w-[45rem] h-[40rem] relative flex flex-col justify-between overflow-hidden pl-24"
              >
                <div className="absolute top-0 left-0 h-full rounded-xl ml-24 bg-gray-300">
                  {project.video ? (
                    project.youtube ? (
                      <YouTube
                        videoId={project.video.split("https://youtu.be/")[1]}
                        onReady={(event) => {
                          videoRefs.current.set(index, event.target);
                        }}
                      />
                    ) : (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current.set(index, el);
                        }}
                        loop
                        autoPlay
                        muted
                        src={project.video}
                        className="h-full object-cover rounded-xl w-[40rem]"
                      />
                    )
                  ) : (
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="h-full object-cover rounded-xl w-[40rem]"
                    />
                  )}
                </div>
                <div className="z-30 px-10 py-10">
                  <p className="text-right">
                    {project.pushTag ? (
                      <span className="rounded-xl bg-blue-700 text-white px-3 py-1">
                        {project.pushTag}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="z-30 flex flex-col space-y-8 px-10 pb-10 text-white">
                  <h3 className="text-4xl font-semibold mix-blend-difference filter text-white">
                    {project.name}
                  </h3>
                  <div className="flex space-x-4 text-sm ">
                    {project.tags?.map((tag, ind) => (
                      <span
                        key={`${tag}-${index}-${ind}`}
                        className="px-3 py-1 border rounded-xl bg-clip-padding filter backdrop-filter bg-gray-500 backdrop-blur-sm bg-opacity-40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

export default App;
