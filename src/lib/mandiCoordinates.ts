// Coordinate lookup for regional mandis with central APMC fallback
export function getMandiCoordinates(mandiName: string): [number, number] {
  const name = (mandiName || '').toLowerCase();
  if (name.includes('burdwan') || name.includes('বর্ধমান')) return [23.2324, 87.8615];
  if (name.includes('kalna')) return [23.2185, 88.3686];
  if (name.includes('memari')) return [23.1812, 88.1132];
  if (name.includes('khanna')) return [30.7071, 76.2198];
  if (name.includes('ludhiana')) return [30.9010, 75.8573];
  if (name.includes('bhagta')) return [30.4578, 75.0976];
  if (name.includes('anand')) return [22.5645, 72.9289];
  if (name.includes('petlad')) return [22.4744, 72.8028];
  if (name.includes('varanasi') || name.includes('panchkoshi')) return [25.3176, 82.9739];
  if (name.includes('chandauli')) return [25.2608, 83.2707];
  if (name.includes('mandya')) return [12.5218, 76.8951];
  if (name.includes('maddur')) return [12.5857, 77.0454];
  if (name.includes('lasalgaon')) return [20.1478, 74.2272];
  if (name.includes('nashik') || name.includes('नासिक') || name.includes('dindori')) return [19.9975, 73.7898];
  if (name.includes('alwar')) return [27.5530, 76.6346];
  if (name.includes('khairthal')) return [27.9317, 76.6433];
  if (name.includes('madurai') || name.includes('மதுரை') || name.includes('mattuthavani')) return [9.9252, 78.1198];
  if (name.includes('usilampatti')) return [9.9702, 77.7946];
  if (name.includes('guwahati') || name.includes('pamohi')) return [26.1445, 91.7362];
  if (name.includes('guntur')) return [16.3067, 80.4365];
  if (name.includes('tenali')) return [16.2437, 80.6400];
  if (name.includes('muzaffarpur')) return [26.1209, 85.3647];
  if (name.includes('raipur') || name.includes('dumartarai')) return [21.2514, 81.6296];
  if (name.includes('azadpur') || name.includes('आज़ादपुर') || name.includes('delhi')) return [28.7159, 77.1764];
  if (name.includes('siliguri') || name.includes('শিলিগুড়ি')) return [26.7271, 88.3953];
  if (name.includes('midnapore') || name.includes('মেদিনীপুর')) return [22.4257, 87.3199];
  if (name.includes('malda') || name.includes('মালদা')) return [25.0108, 88.1411];
  if (name.includes('hooghly') || name.includes('হুগলী')) return [22.8963, 88.3995];

  // Default APMC coordinates (Burdwan Agri-Hub)
  return [23.2324, 87.8615];
}

export function getTruckRoute(center: [number, number]): [number, number][] {
  const [lat, lng] = center;
  return [
    [lat - 0.0042, lng - 0.005],
    [lat - 0.0028, lng - 0.0028],
    [lat - 0.0014, lng - 0.0012],
    [lat, lng],
  ];
}
