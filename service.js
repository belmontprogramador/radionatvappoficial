module.exports = async function() {
    TrackPlayer.addEventListener('playback-state', async (event) => {
        console.log('Playback State:', event.state);
    });
};
