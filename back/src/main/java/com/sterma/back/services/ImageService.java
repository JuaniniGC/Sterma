package com.sterma.back.services;

import com.sterma.back.dtos.image.CloudinaryImageDTO;
import com.sterma.back.models.Image;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.repositories.ImageRepository;
import com.sterma.back.repositories.IncidentReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ImageService {

    private ImageRepository imageRepository;
    private CloudinaryService cloudinaryService;
    private IncidentReportRepository incidentReportRepository;

    public ImageService(ImageRepository imageRepository, CloudinaryService cloudinaryService, IncidentReportRepository incidentReportRepository) {
        this.imageRepository = imageRepository;
        this.cloudinaryService = cloudinaryService;
        this.incidentReportRepository = incidentReportRepository;
    }

    @Transactional
    public Image updateImage (Long incidentReportId, MultipartFile file) throws IOException, NoSuchElementException, IllegalArgumentException{
        checkIncidentReportExists(incidentReportId);
        IncidentReport incidentReport = incidentReportRepository.getReferenceById(incidentReportId);

        CloudinaryImageDTO cloudinaryImage = cloudinaryService.uploadImage(file.getBytes());
        Image newImage = Image.builder()
                .imagePublicId(cloudinaryImage.getPublicId())
                .incidentReport(incidentReport)
                .build();

        return imageRepository.save(newImage);
    }

    @Transactional(readOnly = true)
    public List<String> getImagesByIncidentReport(Long incidentReportId) throws IOException, NoSuchElementException, IllegalArgumentException {
        checkIncidentReportExists(incidentReportId);
        List<Image> images = imageRepository.findByIncidentReportId(incidentReportId);
        return images.stream()
                .map(image -> cloudinaryService.getImageUrl(image.getImagePublicId()))
                .toList();
    }

    private void checkIncidentReportExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        if (!incidentReportRepository.existsById(id)) {
            throw new NoSuchElementException("Informe no encontrado con ID: " + id);
        }
    }

}
