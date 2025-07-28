package com.sterma.back.services;

import com.sterma.back.models.Community;
import com.sterma.back.models.Technician;
import com.sterma.back.repositories.CommunityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    @Transactional(readOnly = true)
    public Page<Community> listAll(Pageable pageable) {
        return communityRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Optional<Community> getById(Long id){
        return communityRepository.findById(id);
    }

}
