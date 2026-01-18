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


    // Obtener todas las reglas mensuales
    default List<MaintenanceRule> findMonthlyRules() {
        return findByMaintenanceTypeOrderByOrderNum(MaintenanceType.MONTHLY);
    }

    // Obtener reglas mensuales y bianuales
    default List<MaintenanceRule> findMonthlyAndBiannualRules() {
        Set<MaintenanceType> types = Set.of(MaintenanceType.MONTHLY, MaintenanceType.BIANNUAL);
        return findByMaintenanceTypesInOrderByOrderNum(types);
    }

    // Obtener reglas mensuales, bianuales y anuales
    default List<MaintenanceRule> findMonthlyBiannualAndAnnualRules() {
        Set<MaintenanceType> types = Set.of(MaintenanceType.MONTHLY, MaintenanceType.BIANNUAL, MaintenanceType.ANNUAL);
        return findByMaintenanceTypesInOrderByOrderNum(types);
    }

    // Método genérico para cualquier combinación de tipos
    default List<MaintenanceRule> findRulesByTypes(MaintenanceType... types) {
        return findByMaintenanceTypesInOrderByOrderNum(Set.of(types));
    }

    // Método adicional: encontrar reglas por tipo ordenadas
    List<MaintenanceRule> findByMaintenanceTypeInOrderByMaintenanceTypeAscOrderNumAsc(List<MaintenanceType> maintenanceTypes);
}