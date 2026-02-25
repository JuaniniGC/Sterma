package com.sterma.back.repositories;

import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface MaintenanceRuleRepository extends JpaRepository<MaintenanceRule, Long> {
    List<MaintenanceRule> findByMaintenanceTypeOrderByOrderNum(MaintenanceType maintenanceType);

    List<MaintenanceRule> findAllByOrderByOrderNum();

    @Query("SELECT mr FROM MaintenanceRule mr WHERE mr.maintenanceType IN :types ORDER BY mr.orderNum")
    List<MaintenanceRule> findByMaintenanceTypesInOrderByOrderNum(@Param("types") Set<MaintenanceType> types);

    default List<MaintenanceRule> findMonthlyRules() {
        return findByMaintenanceTypeOrderByOrderNum(MaintenanceType.MONTHLY);
    }
    default List<MaintenanceRule> findMonthlyAndBiannualRules() {
        Set<MaintenanceType> types = Set.of(MaintenanceType.MONTHLY, MaintenanceType.BIANNUAL);
        return findByMaintenanceTypesInOrderByOrderNum(types);
    }
    default List<MaintenanceRule> findMonthlyBiannualAndAnnualRules() {
        Set<MaintenanceType> types = Set.of(MaintenanceType.MONTHLY, MaintenanceType.BIANNUAL, MaintenanceType.ANNUAL);
        return findByMaintenanceTypesInOrderByOrderNum(types);
    }
    default List<MaintenanceRule> findRulesByTypes(MaintenanceType... types) {
        return findByMaintenanceTypesInOrderByOrderNum(Set.of(types));
    }
    List<MaintenanceRule> findByMaintenanceTypeInOrderByMaintenanceTypeAscOrderNumAsc(List<MaintenanceType> maintenanceTypes);
}