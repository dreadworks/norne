{
    "lanes": [{

        "dist": 0,
        "color": "#cccccc",
        "renderer": {
            "ground": "simple",
            "color": "gradient"
        },

        "points": [
            { "x": -200, "y": 200 },
            { "x": 160, "y": 230 },
            { "x": 800, "y": 80 },
            { "x": 1300, "y": 160 },
            { "x": 1800, "y": 0}
        ],

        "bodies": [{
            "color": "0099ff",
            "forces": [
                { "type": "field", "x": 160, "y": 100 }
            ],
            "particles": {
                "x": 0, "y": 100, "r": 2,
                "type": "circle",
                "amount": 500,
                "scatter": 20
            },
            "renderer": {
                "color": "solid",
                "shape": "round"
            }
        }]

    }, {

        "dist": 20,
        "color": "dddddd",
        "renderer": {
            "ground": "bezier-debug",
            "color": "gradient"
        },

        "points": [
            { "x": 400, "y": 180 },
            { "x": 800, "y": 200 },
            { "x": 1200, "y": 130 },
            { "x": 2000, "y": 170 },
            { "x": 3000, "y": 20 },
            { "x": 4000, "y": 100 },
            { "x": 5000, "y": 60 },
            { "x": 6000, "y": 100 }
        ]

    }, {

        "dist": 40,
        "color": "eeeeee",
        "renderer": {
            "ground": "bezier-debug",
            "color": "gradient"
        },

        "points": [
            { "x": -200, "y": 400 },
            { "x": 500, "y": 500 },
            { "x": 1500, "y": 300 },
            { "x": 2300, "y": 350 },
            { "x": 3500, "y": -100 },
            { "x": 5000, "y": 200 },
            { "x": 5500, "y": 160 },
            { "x": 6000, "y": 180 },
            { "x": 6500, "y": 0 }
        ]

    }]
}