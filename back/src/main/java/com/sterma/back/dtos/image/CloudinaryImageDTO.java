package com.sterma.back.dtos.image;

import lombok.Data;

@Data
public class CloudinaryImageDTO {
    private String publicId;
    private String url;
    private String secureUrl;
    private String format;
    private Integer width;
    private Integer height;

}
