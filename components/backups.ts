function prev() {
  let calcLeft = 0;
  setIndex(index - 1);
  const previndex = slideRef.current?.children[0].children[index - 1].clientWidth!;
  if (!started) {
    calcLeft = initpositinX + finishPosition
  } else {
    calcLeft = previndex + finishPosition;
  }
  setPositionX(calcLeft);
  setFinishPosition(calcLeft);
  setStarted(true);
}

function next() {

  const getIndex = slideRef.current?.children[0].children.length! - 1;

  if (getIndex === index) {
    nextIndex(1);
    setStarted(false);
  } else {
    setIndex(index + 1);
    const nextindex = slideRef.current?.children[0].children[index].clientWidth!;
    const calcRight = -nextindex + positonX;
    setPositionX(calcRight);
    setFinishPosition(calcRight);
    setStarted(true);
  }
}
