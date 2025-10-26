package com.sterma.back.dtos.community.list;

import com.sterma.back.models.Community;
import com.sterma.back.models.Elevator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListCommunityResponse {
    private Long id;
    private String name;
    private String description;
    private String CIF;
    private String city;
    private String postalCode;
    private String street;
    private String communityLeaderName;
    private String communityLeaderTelephone;
    private String communityLeaderNote;
    private List<Elevator> elevators;

    public static ListCommunityResponse from(Community community, List<Elevator> elevators) {
        return ListCommunityResponse.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .CIF(community.getCIF())
                .city(community.getLocalization().getCity())
                .postalCode(community.getLocalization().getPostalCode())
                .street(community.getLocalization().getStreet())
                .communityLeaderName(community.getCommunityLeaderInfo().getCommunityLeaderName())
                .communityLeaderTelephone(community.getCommunityLeaderInfo().getCommunityLeaderTelephone())
                .communityLeaderNote(community.getCommunityLeaderInfo().getCommunityLeaderNote())
                .elevators(elevators)
                .build();
    }
}
