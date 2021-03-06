import { IPlayer } from "utils/types";
import { MobileContext } from "components/App";
import React from "react";
import Section from "components/Section";
import { useData } from "context";
import useStyles from "./PlayersSection.styles";
import { useTranslation } from "react-i18next";

export default function PlayersSection(): JSX.Element {
  const { t } = useTranslation();
  const {
    innocentPlayers,
    susPlayers,
    evilPlayers,
    deadPlayers,
    unknownPlayers,
    setInnocentPlayers,
    setSusPlayers,
    setEvilPlayers,
    setDeadPlayers,
    setUnknownPlayers,
  } = useData()!; // eslint-disable-line

  const { isMobile } = React.useContext(MobileContext);
  const classes = useStyles({ isMobile });

  interface Section {
    title: string;
    list: Array<IPlayer>;
    setList: (value: Array<IPlayer>) => void;
  }

  const sections: Array<Section> = [
    {
      title: t("main.lists.innocent"),
      list: innocentPlayers,
      setList: setInnocentPlayers,
    },
    {
      title: t("main.lists.suspicious"),
      list: susPlayers,
      setList: setSusPlayers,
    },
    {
      title: `${t("main.lists.evil")} / ${t("main.lists.hitList")}`,
      list: evilPlayers,
      setList: setEvilPlayers,
    },
    {
      title: t("main.lists.dead"),
      list: deadPlayers,
      setList: setDeadPlayers,
    },
    {
      title: t("main.lists.unknown"),
      list: unknownPlayers,
      setList: setUnknownPlayers,
    },
  ];

  return (
    <div className={classes.root}>
      {sections.map(({ title, list, setList }) => (
        <Section
          key={title}
          title={title}
          list={list}
          setList={setList}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
