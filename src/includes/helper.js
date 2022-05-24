export default {
  formatTimeMine(time) {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    const seconds = secs > 10 ? `${Math.floor(secs)}` : `0${Math.floor(secs)}`;
    // console.log(`${mins}:${seconds}`, 'format time abdullahi');
    return `${mins}:${seconds}`;
  },
  formatTime(time) {
    const mins = Math.floor(time / 60) || 0;
    const secs = Math.round((time - (mins * 60))) || 0;

    // console.log(`${mins}:${secs < 10 ? '0' : ''}${secs}`, 'format time luiz');
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
};
