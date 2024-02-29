import ModalActionIcon from "../../components/ModalActionIcon";

export default function ExplainNak() {
  return (
    <ModalActionIcon modalHeading="About 27 Nakshastra and 28 Xiu">
      <h4>Nakshastra</h4>
      <p>
        Each nakshastra starts and ends at a certain degree of longitude. So set
        on sidereal/tropical matters. <strong>True Citra </strong>is one of the
        most common choices.
      </p>

      <h4>Xiu (Twenty-Eight Mansions in Chinese)</h4>
      <p>
        The method to get the mansions' position is similar to '黃道回歸今宿' in
        most software, which means, we lookup each determinative star (距星)'s
        ecliptic longitude.
      </p>
      <p>
        <strong>Determinative star </strong>changes over time. At least two
        major systems exist: 古宿 and 今宿. 古宿 is used about 2000 years ago,
        while 今宿 is used from about 2000 years ago until now.
      </p>
      <p>Both 古宿 and 今宿 have numerous variants.</p>
      <p>
        During the Qing dynasty, each star was assigned an index, and since then
        the determinative stars have been somewhat settled (with index 1 being
        the determinative star!)
      </p>
      <p>
        However, there have still been a few changes since then: 觜 and 參
        change their position in elongation (This is the the drawback to use
        elongation longitude instead of ecliptic longitude. Elongation keeps
        changing).
      </p>
      <p>
        After a long debate, people reach an agreement to change both 觜 and 參
        determinative stars so that their relatively positions remain the same.
      </p>
      <p>
        By the way, 觜 and 參's determinative stars will swap again in the year
        4000, and again in the year 5000. Should we change their determinative
        stars multiple time?{" "}
      </p>
      <p>
        Another change is the determinative star of 奎. People suspect that
        before the Ming Dynasty, 奎宿二 is more likely to be the determinative
        star of 奎. I use 奎宿二 as it is listed in wiki page.
      </p>
      <p>
        There has always been a debate: which matters more, the degree of the
        mansions or the determinative star of the mansions?
        <li>
          If the degree is the most important thing, and the star are just the
          ruler in the sky, then we could always change the determinative star
          without guilt, to fit the degree.
        </li>
        <li>
          {" "}
          If the star is what matters, then even if the stars swap in
          elongation, we should not change the star.
        </li>{" "}
        In history, both degrees and determinative stars change gradually.
      </p>
      <p>
        Personally, I would say that star matters more than degrees, and that is
        why I use fixed star to get the position of the mansions.
      </p>
      <p>古宿 more read on 放马滩简《星度》新研 by 程少軒</p>
      <p>今宿 at least each dynasty has a slightly different one.</p>
    </ModalActionIcon>
  );
}
