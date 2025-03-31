import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Dropdown from "./components/dropdown";
import { ReactComponent as ListIcon } from "./components/list.svg";
import { ReactComponent as ThreeLinesIcon } from "./components/threeLines.svg";
import { ReactComponent as Drop } from "./components/drop.svg";
import Accordion from "@mui/material/Accordion";
import { AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Mousewheel,
} from "swiper/modules";

function App() {
  const [viewMode, setViewMode] = useState("features");
  const [compact, isCompact] = useState(false);
  const [showAccordions, setShowAccordions] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const [activeSection, setActiveSection] = useState(""); // Track active section
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement | null>(null); // Reference for .app-content

  const sections = [
    { id: "analysis", title: "Analysis of the current website" },
    { id: "preparation", title: "Visual redesign" },
    { id: "empathy", title: "Responsive redesign" },
  ];

  useEffect(() => {
    const contentEl = contentRef.current; // Get .app-content div

    const handleScroll = () => {
      if (!contentEl) return; // Safety check

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[sections[i].id];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= contentEl.getBoundingClientRect().top + 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    if (contentEl) {
      contentEl.addEventListener("scroll", handleScroll);
      return () => contentEl.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    setShowAccordions(false);
    const timer = setTimeout(() => setShowAccordions(true), 1);
    return () => clearTimeout(timer);
  }, [compact]);

  const handleSelect = (
    section: string,
    item: { label: string },
    binaryState?: number
  ) => {
    if (section === "Display") {
      const a = compact;
      isCompact(item.label !== "Compact");
    }
  };

  const viewOptions = [
    {
      title: "Display",
      useAsDropTitle: true,
      useIcon: true,
      items: [
        { label: "Compact", icon: <ThreeLinesIcon /> },
        { label: "List", icon: <ListIcon /> },
      ],
    },
  ];
  return (
    <div className="app">
      <div
        style={{
          display: "flex",
          alignContent: "start",
          marginRight: "50px",
          width: "500px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "500px",
            marginLeft: "-30px",
          }}
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: "black" }}>
            Redesigning MamiSinCancer's webpage
          </h1>
          <div style={{ color: "black", width: "320px", fontSize: "large" }}>
            The current webpage will display my work on analysing the issues
            with the current website. Then I will generate a new model and a
            prototype for how to address these issues
          </div>
          <div
            style={{ marginTop: "50px", marginBottom: "30px", height: "100%" }}
          >
            <Dropdown
              sections={viewOptions}
              closeOnSelect={false}
              onSelect={handleSelect}
            />
          </div>
          <nav className="sidebar-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-link ${
                  activeSection === section.id ? "active" : ""
                }`}
                onClick={() => {
                  const contentEl = contentRef.current;
                  const targetEl = sectionRefs.current[section.id];

                  if (contentEl && targetEl) {
                    const offsetTop = targetEl.offsetTop - contentEl.offsetTop;
                    contentEl.scrollTo({
                      top: offsetTop,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div
        className="app-content space-y-3"
        style={{
          position: "absolute",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollbarWidth: "none",
          height: "920px",
          right: "100px",
          maxWidth: "900px",
          padding: "30px",
        }}
        ref={contentRef}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <section className="intro-section">
            <h2
              className="section-title"
              ref={(el) => {
                if (el) sectionRefs.current["analysis"] = el;
              }}
            >
              Analysis of MamiSinCancer's currect webpage
            </h2>
            <p>
              Before going into the analysis, the reason why I chose this
              website because it relates to the NGO that I created to fight
              against cancer. This page was made with wix but now it needs a
              redesign given the time that has passed. To make MamisinCancer’s
              outreach greater, having a good website is important. Here is the
              current version:
            </p>
            <a
              href="https://mamisincancer.wixsite.com/my-site-4"
              target="_blank"
            >
              MamisinCancer
            </a>

            <p>
              Lets start the analysis by going through the page and identifying
              elements that could hinder the usabulity learnability or
              accesibility of the page.
            </p>
          </section>
          {showAccordions && (
            <Accordion
              defaultExpanded={compact}
              disableGutters
              elevation={0}
              className="transition-all border-b border-gray-200 hover:bg-gray-50"
              style={{
                backgroundColor: "#FDEEF5",
                border: "none",
                borderRadius: "15px",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <div style={{ maxWidth: "18px", maxHeight: "18px" }}>
                    <Drop />
                  </div>
                }
                className="py-2"
              >
                <Typography variant="h6" className="font-medium text-gray-800">
                  Annonated webpage
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="pl-4 space-y-1">
                <img src={"./images/OG1.png"} className="imageAnalysis" />
                <Typography className="imageTextSmall">
                  The main issues here lie on the abundance of different colors
                  and the odd spacing and padding which may make it hard to read
                  or find items for people with disabilities. Additinoally,
                  having no indication or control over the carousel makes it
                  hard to use and learn as the images take a decent amount of
                  time to change. This makes it so users may miss critical
                  information because of the poor style choices or the hard
                  discoverability of components.
                </Typography>
                <img src={"./images/OG2.png"} className="imageAnalysis" />
                <Typography className="imageTextSmall">
                  In this part the main isues come from the unnecesary
                  repetition of information because it is written in engligh and
                  spanish. Additionally, many of the fonts used seem like they
                  are buttons when they aren't making it confusing and hard to
                  learn. Finally, the lack of cohesion in padding and margins
                  makes the page visually unappealing meaning users may not want
                  to continue exploring other parts of the site.
                </Typography>
                <img src={"./images/OG3.png"} className="imageAnalysis" />
                <Typography className="accordionText">
                  As with the previous parts, there is too much unnecesary
                  information and the margins and padding are incoherent. There
                  are too many colors and the fonts and sizes don't follor an
                  order. Infact some of the texts cuts off and is unreadable for
                  the user. All of this discourages the user from interacting
                  with the page and learn about prevention and our work.
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {showAccordions && (
            <Accordion
              defaultExpanded={compact}
              disableGutters
              elevation={0}
              className="transition-all border-b border-gray-200 hover:bg-gray-50"
              style={{
                backgroundColor: "#FDEEF5",
                border: "none",
                borderRadius: "15px",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <div style={{ maxWidth: "18px", maxHeight: "18px" }}>
                    <Drop />
                  </div>
                }
                className="py-2"
              >
                <Typography variant="h6" className="font-medium text-gray-800">
                  Accesibility Web Aim web
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="pl-4 space-y-1">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src={"./images/oldWebAim.png"}
                    style={{ width: "60%" }}
                    className="imageAnalysis"
                  />
                </div>
                <Typography className="accordionText">
                  WebAim Wave mainly had issues with visibility regarding
                  colors. I agree with this to an extent, while I think that
                  some colors could be better suited I also think that they are
                  readable but they are hard to look at because of all of the
                  added italics + bold + font size. Additionally we have an
                  error from the lack of aria-lable on a title. We also have
                  many alers regarding size of texts and margins and padding
                  which aligns with the previous analysis
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {showAccordions && (
            <Accordion
              defaultExpanded={compact}
              disableGutters
              elevation={0}
              className="transition-all border-b border-gray-200 hover:bg-gray-50"
              style={{
                backgroundColor: "#FDEEF5",
                border: "none",
                borderRadius: "15px",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <div style={{ maxWidth: "18px", maxHeight: "18px" }}>
                    <Drop />
                  </div>
                }
                className="py-2"
              >
                <Typography variant="h6" className="font-medium text-gray-800">
                  Summary of issues
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="pl-4 space-y-1">
                <Typography className="accordionText">
                  Overall, the main issues regarding accesibility come from the
                  abundance of colors, fonts and sizes in the page which makes
                  the text hard to read or visually unappealing. Additionally,
                  there is an abundance in repetition of information in engligh
                  and spanish. There are elements like the carousel which are
                  hard to learn and use. Also The navigation bar is purely in
                  spanish so the page doesn't even fully account for both types
                  of langauges. Moreover, some of the texts cuts off and some of
                  the titles seems like buttons. This makes the process of
                  discovery and usage very unintuitive and confusing. It is also
                  not very efficient at delivering the message of the importance
                  of prevention and what the organization has done as there is
                  too much clutter. At last, the webpage is not responsive at
                  all to changes in aspect ratios. Below we can see a screenshot
                  of mobile versions:
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src={"./images/OGphone1.png"}
                    style={{ width: "30%" }}
                    className="imageAnalysis"
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          )}
          <div>
            <h2
              className="section-title"
              ref={(el) => {
                if (el) sectionRefs.current["preparation"] = el;
              }}
            >
              Visual Redesign
            </h2>
            <img src={"./images/VDSG.png"} className="imageAnalysis" />
            <h3 className="imageTextSmall">
              For the Visual Design Style guide I decided to first start by
              picking the colors. Having a reduced coherent set of colors would
              help make the page easier for the eyes. This same argument can be
              applied for the fonts and sizes of text. Additionally, components
              like the toggle button or symbols like the prevention one were
              chosen to decrease the number of words in the page. Making easier
              for the users to navigate the page.
            </h3>
            <h3 className="imageTextSmall">
              Fun fact, this analysis webpage was also made using this design
              guide!
            </h3>
            <img src={"./images/F1.png"} className="imageAnalysis" />
            <h3 className="imageTextSmall">
              On this first screen we can clearly see how having consistent
              colors, padding and fonts instantly makes the page more appealable
              for usage. The navigation bar is clear and contains a toggle to
              swtich between engligh and spanish which modifies the whole
              webpage. The carousel is now clear and users know that images
              change and they can manually see all of them.
            </h3>
            <img src={"./images/F2.png"} className="imageAnalysis" />
            <h3 className="imageTextSmall">
              On this next page we can see how text no longer clutters the page.
              We now have clear sections and a coherent structure with padding,
              margins and borders. This makes it easier for the users to
              undersrand what information is being convayed. Additionally, there
              is a coherent structure to the text and videos, they are now
              properlly pared up.
            </h3>
            <img src={"./images/F3.png"} className="imageAnalysis" />
            <h3 className="imageTextSmall">
              As mentioned before, the usability of the page is much better as
              finding information about cancer and prevention is readily
              available and easy to see for those with disabilities as the fonts
              sizes and types are consisten and easily readable. All of the
              texts can be ready by aria lables and the videos are also tagged.
              The icons help to guide the user to the information they look for.
            </h3>
            <img src={"./images/F4.png"} className="imageAnalysis" />
            <h3 className="imageTextSmall">
              At last, we mantain the order and structure captured in previous
              sections. Also, apart from suporting english and spanish as
              languages, we also clearly include an audio in Quechua, a spoken
              language, which accompanies and explains many of the important
              points about prevention and the fight against cancer.
            </h3>
            {showAccordions && (
              <Accordion
                defaultExpanded={compact}
                disableGutters
                elevation={0}
                className="transition-all border-b border-gray-200 hover:bg-gray-50"
                style={{
                  backgroundColor: "#FDEEF5",
                  border: "none",
                  borderRadius: "15px",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <div style={{ maxWidth: "18px", maxHeight: "18px" }}>
                      <Drop />
                    </div>
                  }
                  className="py-2"
                >
                  <Typography
                    variant="h6"
                    className="font-medium text-gray-800"
                  >
                    IPad Version
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="pl-4 space-y-1">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <img
                      src={"./images/ipad1.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                    <img
                      src={"./images/ipad2.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <img
                      src={"./images/ipad3.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                    <img
                      src={"./images/ipad4.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                  </div>
                  <Typography className="accordionText">
                    As we can see, most of the elements are the same as in the
                    desktop version. The main difference is the hamburger menu
                    instead of the navigation bar which helps to reduce
                    cluttering like in the original mobile version. For all
                    other aspects, some of the sections have been streched to
                    maintain readability and avoid cutting elements to the
                    sides. The carousel has its images reduced and the embeded
                    videos have reduced their scale but mantaining their aspect
                    ratio. Elements such as the sections and their layouts are
                    kept the same as the desktop version.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
            {showAccordions && (
              <Accordion
                defaultExpanded={compact}
                disableGutters
                elevation={0}
                className="transition-all border-b border-gray-200 hover:bg-gray-50"
                style={{
                  backgroundColor: "#FDEEF5",
                  border: "none",
                  borderRadius: "15px",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <div style={{ maxWidth: "18px", maxHeight: "18px" }}>
                      <Drop />
                    </div>
                  }
                  className="py-2"
                >
                  <Typography
                    variant="h6"
                    className="font-medium text-gray-800"
                  >
                    Phone Version
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="pl-4 space-y-1">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <img
                      src={"./images/phone1.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                    <img
                      src={"./images/phone2.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <img
                      src={"./images/phone3.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                    <img
                      src={"./images/phone4.png"}
                      style={{ width: "40%" }}
                      className="imageAnalysis"
                    />
                  </div>
                  <Typography className="accordionText">
                    For the mobile version we mantain the hamburger menu for the
                    navigation bar, however nor more items have changes. The
                    carousel now only presents a single image but it preserves
                    the arrows to the sides to indicate there are more images.
                    Also sections which had elements in columns now change to
                    have their elements in rows. All other elements are
                    preserved or scale down to neatly fit the new aspect ratio.
                    In comparaison to the original, this is a major improvement
                    as the webpage is now usable in a phone device
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </div>
          <h2
            className="imageText"
            ref={(el) => {
              if (el) sectionRefs.current["empathy"] = el;
            }}
          >
            Responsive Redesign
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <iframe
              src="https://mamisin-cancer.vercel.app/"
              width="80%"
              height="600"
              loading="lazy"
              style={{ border: "none" }}
            />
            <h3>
              <a
                href="https://mamisin-cancer.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-button"
              >
                Click here to see the full webpage
              </a>
            </h3>
          </div>

          <h2
            ref={(el) => {
              if (el) sectionRefs.current["storyboard"] = el;
            }}
          ></h2>
          <section className="conclusion-section">
            <h2 className="section-title">Conclusion</h2>
            <p style={{ marginBottom: "50px", marginTop: "20px" }}>
              <h3 className="imageTextSmall">
                Overall, this project has allowed me to analyze what elements
                constitute a bad website and ways to address these issues.
                Having in mind diferent languages, or a responsive design are
                things that may not come intuitive at a first glance but that
                are crucial for an accesible and easy to use website.
                Additionally, the process of creating a style guide and mockups
                for the webpage helped tremendously as I was able to plan ahead
                and design reusable components for my diferent aspect ratios and
                devices.
              </h3>
            </p>
            <p style={{ marginBottom: "50px", marginTop: "20px" }}></p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
