export async function initParams(){
    const params = new URLSearchParams(window.location.search);
    const v = params.get('von');
    const b = params.get('bis');
    const ahID = params.get('abholStationID');
    const agID = params.get('abgabeStationID');

    const ah = await fetch(`/return/station?stationID=${ahID}`)
        .then(res => res.json())
        .then(data => data.name)
        .catch(() => null);

    const ag = await fetch(`/return/station?stationID=${agID}`)
        .then(res => res.json())
        .then(data => data.name)
        .catch(() => null);

    return {
        v,
        b,
        ahID,
        agID,
        ah,
        ag
    };
}