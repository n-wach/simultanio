export default class Res {
    public static tile_colors = {
        "land": {
            "minimapV": [0xac, 0xbd, 0x95, 0xff],
            "minimapPV": [0xac * 0.8, 0xbd * 0.8, 0x95 * 0.8, 0xff],
            "style": "#acbd95",
        },
        "water": {
            "minimapV": [0x7c, 0xa1, 0x9f, 0xff],
            "minimapPV": [0x7c * 0.8, 0xa1 * 0.8, 0x9f * 0.8, 0xff],
            "style": "#7ca19f",
        },
        "matter_source": {
            "minimapV": [0xcf, 0xb4, 0x94, 0xff],
            "minimapPV": [0xcf * 0.8, 0xb4 * 0.8, 0x94 * 0.8, 0xff],
            "style": "#cfb494",
        },
        "unknown": {
            "minimapV": [0xad, 0xa4, 0x9c, 0xff],
            "minimapPV": [0xad, 0xa4, 0x9c, 0xff],
            "style": "#ada49c",
        },
    };

    // ui
    public static col_bg :string = "#cfc5ba";
    public static col_uifg :string = "#f0e4f7";
    public static col_uifg_accent :string = "#d2b0e8";
    public static col_uibg :string = "#526266";
    public static col_uibg_accent :string = "#7a8d91";
    
    // color palette
    public static pal_black :string = "#111111";

    // fonts
    public static font_face :string = "Share Tech Mono";
    public static max_font :number = 24;

}