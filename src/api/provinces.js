const baseItems = [
    { id: "item-1", name: "강원도 벌꿀차", image: "/images/sample1.jpg" },
    { id: "item-2", name: "초당 옥수수 밀크 티", image: "/images/sample2.jpg" },
    { id: "item-3", name: "삼척 바다 파노라마", image: "/images/sample3.jpg" }
];

const rectangleFeature = (province) => {
    const { west, east, south, north } = province.bounds;
    const coordinates = [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south]
    ];

    const center = province.center ?? [
        (south + north) / 2,
        (west + east) / 2
    ];

    return {
        type: "Feature",
        properties: {
            id: province.id,
            name: province.name,
            center
        },
        geometry: {
            type: "Polygon",
            coordinates: [coordinates.map(([lng, lat]) => [lng, lat])]
        }
    };
};

export const PROVINCES = [
    {
        id: "seoul",
        name: "서울",
        bounds: { west: 126.8, east: 127.1, south: 37.45, north: 37.7 },
        heroImage: "/images/seoul_backgound.png",
        items: baseItems
    },
    {
        id: "incheon",
        name: "인천",
        bounds: { west: 126.3, east: 126.9, south: 37.2, north: 37.6 },
        heroImage: "/images/sample2.jpg",
        items: baseItems
    },
    {
        id: "gyeonggi",
        name: "경기도",
        bounds: { west: 126.5, east: 127.8, south: 36.9, north: 38.2 },
        heroImage: "/images/sample3.jpg",
        items: baseItems
    },
    {
        id: "gangwon",
        name: "강원도",
        bounds: { west: 127.3, east: 129.4, south: 37.0, north: 38.6 },
        heroImage: "/images/sample3.jpg",
        items: baseItems
    },
    {
        id: "chungbuk",
        name: "충청북도",
        bounds: { west: 127.2, east: 128.2, south: 36.0, north: 37.1 },
        heroImage: "/images/sample1.jpg",
        items: baseItems
    },
    {
        id: "chungnam",
        name: "충청남도",
        bounds: { west: 126.3, east: 127.4, south: 36.0, north: 36.9 },
        heroImage: "/images/sample2.jpg",
        items: baseItems
    },
    {
        id: "sejong",
        name: "세종",
        bounds: { west: 127.2, east: 127.4, south: 36.4, north: 36.6 },
        heroImage: "/images/sample1.jpg",
        items: baseItems
    },
    {
        id: "daejeon",
        name: "대전",
        bounds: { west: 127.2, east: 127.5, south: 36.2, north: 36.5 },
        heroImage: "/images/sample2.jpg",
        items: baseItems
    },
    {
        id: "jeonbuk",
        name: "전라북도",
        bounds: { west: 126.5, east: 127.5, south: 35.3, north: 36.0 },
        heroImage: "/images/sample3.jpg",
        items: baseItems
    },
    {
        id: "jeonnam",
        name: "전라남도",
        bounds: { west: 126.1, east: 127.6, south: 34.2, north: 35.3 },
        heroImage: "/images/sample2.jpg",
        items: baseItems
    },
    {
        id: "gwangju",
        name: "광주",
        bounds: { west: 126.7, east: 127.0, south: 34.9, north: 35.3 },
        heroImage: "/images/sample1.jpg",
        items: baseItems
    },
    {
        id: "gyeongbuk",
        name: "경상북도",
        bounds: { west: 127.7, east: 129.6, south: 35.5, north: 37.1 },
        heroImage: "/images/sample3.jpg",
        items: baseItems
    },
    {
        id: "daegu",
        name: "대구",
        bounds: { west: 128.3, east: 128.8, south: 35.7, north: 36.0 },
        heroImage: "/images/sample1.jpg",
        items: baseItems
    },
    {
        id: "gyeongnam",
        name: "경상남도",
        bounds: { west: 127.6, east: 129.3, south: 34.7, north: 35.8 },
        heroImage: "/images/sample2.jpg",
        items: baseItems
    },
    {
        id: "busan",
        name: "부산",
        bounds: { west: 128.9, east: 129.3, south: 35.0, north: 35.3 },
        heroImage: "/images/sample3.jpg",
        items: baseItems
    },
    {
        id: "ulsan",
        name: "울산",
        bounds: { west: 129.0, east: 129.4, south: 35.3, north: 35.7 },
        heroImage: "/images/sample1.jpg",
        items: baseItems
    },
    {
        id: "jeju",
        name: "제주",
        bounds: { west: 126.1, east: 126.9, south: 33.1, north: 33.6 },
        heroImage: "/images/sample2.jpg",
        items: baseItems
    }
];

export const koreaGeoJson = {
    type: "FeatureCollection",
    features: PROVINCES.map(rectangleFeature)
};
