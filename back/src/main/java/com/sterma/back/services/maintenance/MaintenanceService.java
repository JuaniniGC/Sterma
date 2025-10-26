package com.sterma.back.services.maintenance;

import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.repositories.MaintenanceReportRepository;
import com.sterma.back.repositories.MaintenanceRuleRepository;
import com.sterma.back.services.maintenance.strategy.MaintenanceServiceStrategy;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class MaintenanceService {

    private final Map<MaintenanceType, MaintenanceServiceStrategy> strategyMap = new EnumMap<>(MaintenanceType.class);

    private final MaintenanceReportRepository maintenanceReportRepository;
    private final MaintenanceRuleRepository maintenanceRuleRepository;


    public MaintenanceService(List<MaintenanceServiceStrategy> strategies,
                              MaintenanceReportRepository maintenanceReportRepository,
                              MaintenanceRuleRepository maintenanceRuleRepository){
        this.maintenanceReportRepository = maintenanceReportRepository;
        this.maintenanceRuleRepository = maintenanceRuleRepository;
        for (MaintenanceServiceStrategy strategy : strategies) {
            strategyMap.put(strategy.getType(), strategy);
        }
    }

    public List<MaintenanceRule> getMaintenanceReportRules(String maintenanceType) {
        MaintenanceType type;
        try {
            type = MaintenanceType.valueOf(maintenanceType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new NoSuchElementException("Tipo de mantenimiento no válido: " + maintenanceType);
        }
        MaintenanceServiceStrategy strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new NoSuchElementException("No se ha encontrado estrategia para el tipo de mantenimiento: " + maintenanceType);
        }
        List<MaintenanceRule> rules = strategy.getRules();
        if (rules == null || rules.isEmpty()) {
            throw new NoSuchElementException("No se han encontrado reglas para el tipo de mantenimiento: " + maintenanceType);
        }
        return rules;
    }
}
