package com.sterma.back.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sterma.back.dtos.image.CloudinaryImageDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret
    ) {

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public CloudinaryImageDTO uploadImage(byte[] fileBytes) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.emptyMap());
        CloudinaryImageDTO dto = new CloudinaryImageDTO();
        dto.setPublicId((String) uploadResult.get("public_id"));
        dto.setUrl((String) uploadResult.get("url"));
        dto.setSecureUrl((String) uploadResult.get("secure_url"));
        dto.setFormat((String) uploadResult.get("format"));
        dto.setWidth((Integer) uploadResult.get("width"));
        dto.setHeight((Integer) uploadResult.get("height"));
        return dto;
    }

    public String getImageUrl(String publicId) {
        return cloudinary.url()
                .secure(true)
                .generate(publicId);
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("Error deleting image from Cloudinary", e);
        }
    }
}