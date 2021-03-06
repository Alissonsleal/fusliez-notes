import React from "react";
import { INITIAL_DATA, useData } from "context";
import { JssProvider, ThemeProvider } from "react-jss";
import useStyles from "./App.styles";
import ControlsContent from "./ControlsContent";
import FeedbackForm from "./FeedbackForm";
import Footer from "./Footer";
import MainContent from "./MainContent";
const MapsContent = React.lazy(() => import("./MapsContent"));
import Modal from "components/common/Modal";
const Notes = React.lazy(() => import("./Notes"));
import Recovery from "./Recovery";
const SlideDrawer = React.lazy(() => import("./SlideDrawer"));
import jssSetUp from "utils/jssSetUp";
const Scores = React.lazy(() => import("./Scores"));
const ScoresPanel = React.lazy(() => import("./ScoresPanel"));
import TabNavigator from "./TabNavigator";

type ContextProps = {
  isMobile: boolean;
  orientation: string;
};

export const MobileContext = React.createContext<Partial<ContextProps>>({});

const patchNotes = [
  {
    title: "Highlights",
    items: [
      <>Added support for mobile devices in portrait and landscape</>,
      <>Changed win rate presentation to circular</>,
    ],
  },
  {
    title: "Fixes",
    items: [
      <>Performance issues with notes</>,
      <>"Show Player Names" settings bug</>,
    ],
  },
  {
    title: "Development Notes",
    items: [
      <>We are working in allowing custom theme colors.</>,
      <>
        We can only test the mobile version so much on our side. If you found
        anything that doesn't work as well as you'd like, please leave us a
        feedback!
      </>,
      <>
        We added a feedback link at the bottom at the page, we love to hear from
        all of you.
      </>,
      <>
        If you would like to see all the changes we have made please read our{" "}
        <a href="https://github.com/Kedyn/fusliez-notes/blob/master/CHANGELOG.md">
          CHANGELOG.md
        </a>{" "}
        file.
      </>,
    ],
  },
];

export default function App(): JSX.Element {
  const { version, theme } = useData()!; // eslint-disable-line

  const [showNotes, setShowNotes] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [orientation, setOrientation] = React.useState(
    window.innerHeight > window.innerWidth ? "portrait" : "landscape"
  );
  const [width, setWidth] = React.useState(window.innerWidth);
  const [currentTab, setCurrentTab] = React.useState("Players");

  const breakpoint = 846;

  const isMobile = width <= breakpoint;

  const classes = useStyles({ isMobile, orientation });

  React.useEffect(() => {
    if (version !== INITIAL_DATA.version) {
      setShowNotes(true);
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  React.useEffect(() => {
    const handleOrientationChange = () => {
      // logically, it's supposed to be innerHeight > innerWidth
      // return portrait, but it isn't behaving as expected
      setOrientation(
        window.innerHeight < window.innerWidth ? "portrait" : "landscape"
      );
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [window, orientation]);

  return (
    <React.Fragment>
      <JssProvider registry={jssSetUp(theme)}>
        <ThemeProvider theme={theme}>
          <MobileContext.Provider value={{ isMobile, orientation }}>
            <React.Suspense fallback="loading">
              <Recovery />
              {isMobile ? (
                <>
                  <div>
                    {isDrawerOpen && (
                      <SlideDrawer
                        isDrawerOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                      />
                    )}

                    {currentTab === "Players" ? (
                      <MainContent isMobile={isMobile} />
                    ) : currentTab === "Notes" ? (
                      <Notes isMobile={isMobile} orientation={orientation} />
                    ) : currentTab === "Record" ? (
                      <div className={classes.recordContainer}>
                        <Scores />
                        <ScoresPanel isMobile={isMobile} />
                      </div>
                    ) : currentTab === "Maps" ? (
                      <MapsContent
                        isMobile={isMobile}
                        orientation={orientation}
                      />
                    ) : null}
                  </div>
                  <TabNavigator
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    setIsDrawerOpen={setIsDrawerOpen}
                    orientation={orientation}
                    children={
                      <Footer
                        showNotes={showNotes}
                        setShowNotes={setShowNotes}
                        setShowForm={setShowForm}
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <main>
                    <MainContent isMobile={false} />
                    <ControlsContent />
                    <MapsContent isMobile={false} />
                  </main>
                  <Footer
                    showNotes={showNotes}
                    setShowNotes={setShowNotes}
                    setShowForm={setShowForm}
                  />
                </>
              )}
              <Modal
                title="Feedback Form"
                show={showForm}
                onClose={() => setShowForm(false)}
              >
                <FeedbackForm />
              </Modal>
              {/* CHANGE LOG */}
              <Modal
                title={`Change Log v${version}`}
                show={showNotes}
                onClose={() => setShowNotes(false)}
              >
                {patchNotes.map(({ title, items }) => (
                  <div key={title}>
                    <h3>{title}</h3>
                    <ul>
                      {items.map((item) => (
                        <li key={item.props.children[0]}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Modal>
            </React.Suspense>
          </MobileContext.Provider>
        </ThemeProvider>
      </JssProvider>
    </React.Fragment>
  );
}
