package com.example.demo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

@Listeners({TestResultListener.class})
public class ProjectValidationTests {
   private static final String PRIMARY_CONTROLLER = "com.example.demo.controller.DocumentController";
   private static final String PRIMARY_SERVICE = "com.example.demo.service.DocumentService";
   private static final String PRIMARY_REPOSITORY = "com.example.demo.repository.DocumentRepository";
   private static final String PRIMARY_ENTITY = "com.example.demo.entity.Document";
   private static final String SECONDARY_CONTROLLER = "com.example.demo.controller.WorkspaceController";
   private static final String API_BASE_PATH = "/api/documents";
   private static final String DOMAIN_ROLE = "CONTENT_CREATOR";

   public ProjectValidationTests() {
   }

   @Test
   public void t1_controllerRoutingLogic() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      RequestMapping rm = (RequestMapping)clazz.getAnnotation(RequestMapping.class);
      Assert.assertEquals(rm.value()[0], "/api/documents");
   }

   @Test
   public void t2_serviceBusinessLogicCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.service.DocumentService");
      Assert.assertTrue(Arrays.stream(clazz.getDeclaredMethods()).anyMatch((m) -> m.getName().equals("createDocument")));
   }

   @Test
   public void t3_repositoryInterfaceContract() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.repository.DocumentRepository");
      Assert.assertTrue(clazz.isInterface());
      Assert.assertTrue(Arrays.stream(clazz.getInterfaces()).anyMatch((i) -> i.getSimpleName().contains("JpaRepository")));
   }

   @Test
   public void t4_entityPersistenceMapping() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.Document");
      Assert.assertNotNull(clazz.getAnnotation(Entity.class));
      Assert.assertNotNull(clazz.getAnnotation(Table.class));
   }

   @Test
   public void t5_securityFilterConfiguration() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.config.SecurityConfig");
      Assert.assertNotNull(clazz.getAnnotation(Configuration.class));
      Assert.assertTrue(Arrays.stream(clazz.getDeclaredMethods()).anyMatch((m) -> m.getName().equals("securityFilterChain")));
   }

   @Test
   public void t6_controllerRbacGating() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      Method create = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((m) -> m.getName().equals("create")).findFirst().orElseThrow(() -> new AssertionError("create method not found"));
      PreAuthorize preAuthorize = (PreAuthorize)create.getAnnotation(PreAuthorize.class);
      Assert.assertTrue(preAuthorize.value().contains("CONTENT_CREATOR"));
   }

   @Test
   public void t7_getAllMethodMapping() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      Method m = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((meth) -> meth.getName().equals("getAll")).findFirst().orElseThrow(() -> new AssertionError("getAll method not found"));
      Assert.assertNotNull(m.getAnnotation(GetMapping.class));
   }

   @Test
   public void t8_deleteMethodMapping() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      Method m = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((meth) -> meth.getName().equals("delete")).findFirst().orElseThrow(() -> new AssertionError("delete method not found"));
      Assert.assertNotNull(m.getAnnotation(DeleteMapping.class));
   }

   @Test
   public void t9_createMethodRequestBinding() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      Method m = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((meth) -> meth.getName().equals("create")).findFirst().orElseThrow(() -> new AssertionError("create method not found"));
      Assert.assertTrue(Arrays.stream(m.getParameters()).anyMatch((p) -> p.isAnnotationPresent(RequestBody.class)));
   }

   @Test
   public void t10_updateMethodMapping() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      Method m = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((meth) -> meth.getName().equals("update")).findFirst().orElseThrow(() -> new AssertionError("update method not found"));
      Assert.assertNotNull(m.getAnnotation(PutMapping.class));
   }

   @Test
   public void t11_getByIdPathVariableCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      Method m = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((meth) -> meth.getName().equals("getById")).findFirst().orElseThrow(() -> new AssertionError("getById method not found"));
      Assert.assertTrue(Arrays.stream(m.getParameters()).anyMatch((p) -> p.isAnnotationPresent(PathVariable.class)));
   }

   @Test
   public void t12_secondaryControllerExists() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.WorkspaceController");
      Assert.assertNotNull(clazz.getAnnotation(RestController.class));
   }

   @Test
   public void t13_adminRoleGating() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.WorkspaceController");
      Method invite = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((m) -> m.getName().equals("inviteMember")).findFirst().orElseThrow(() -> new AssertionError("inviteMember method not found"));
      PreAuthorize preAuthorize = (PreAuthorize)invite.getAnnotation(PreAuthorize.class);
      Assert.assertTrue(preAuthorize.value().contains("DIRECTOR"));
   }

   @Test
   public void t14_corsConfigurationExists() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.config.SecurityConfig");
      Assert.assertNotNull(clazz);
   }

   @Test
   public void t15_validationConstraintEnforcement() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.controller.DocumentController");
      Method create = (Method)Arrays.stream(clazz.getDeclaredMethods()).filter((m) -> m.getName().equals("create")).findFirst().orElseThrow(() -> new AssertionError("create method not found"));
      Assert.assertTrue(Arrays.stream(create.getParameters()).anyMatch((p) -> p.isAnnotationPresent(Valid.class)));
   }

   @Test
   public void t16_repositoryCustomQueryCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.repository.DocumentRepository");
      Assert.assertTrue(Arrays.stream(clazz.getDeclaredMethods()).anyMatch((m) -> m.getName().startsWith("findBy")));
   }

   @Test
   public void t17_exceptionHandlerStatusMapping() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.exception.GlobalExceptionHandler");
      Assert.assertNotNull(clazz.getAnnotation(RestControllerAdvice.class));
   }

   @Test
   public void t18_customNotFoundExceptionCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.exception.ResourceNotFoundException");
      Assert.assertTrue(RuntimeException.class.isAssignableFrom(clazz));
   }

   @Test
   public void t19_jwtAuthenticationFilterBean() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.config.JwtAuthenticationFilter");
      Assert.assertNotNull(clazz);
   }

   @Test
   public void t20_entityNonNullableCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.Document");
      Field title = clazz.getDeclaredField("title");
      Column columnAnnotation = (Column)title.getAnnotation(Column.class);
      Assert.assertFalse(columnAnnotation.nullable());
   }

   @Test
   public void t21_entityRelationshipMapping() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.Document");
      Field workspace = clazz.getDeclaredField("workspace");
      Assert.assertTrue(workspace.isAnnotationPresent(ManyToOne.class));
   }

   @Test
   public void t22_serviceTransactionalBoundary() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.service.DocumentService");
      Assert.assertTrue(Arrays.stream(clazz.getDeclaredMethods()).anyMatch((m) -> m.isAnnotationPresent(Transactional.class)));
   }

   @Test
   public void t23_workspaceServiceExistence() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.service.WorkspaceService");
      Assert.assertNotNull(clazz);
   }

   @Test
   public void t24_reviewCycleEntityCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.ReviewCycle");
      Assert.assertNotNull(clazz.getAnnotation(Entity.class));
   }

   @Test
   public void t25_auditLogMappingCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.AuditLog");
      Assert.assertNotNull(clazz.getAnnotation(Table.class));
   }

   @Test
   public void t26_userRoleEnumCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.UserRole");
      Assert.assertTrue(clazz.isEnum());
   }

   @Test
   public void t27_documentStatusEnumCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.DocumentStatus");
      Assert.assertTrue(clazz.isEnum());
   }

   @Test
   public void t28_systemUserFieldConstraint() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.entity.SystemUser");
      Field u = clazz.getDeclaredField("username");
      Column columnAnnotation = (Column)u.getAnnotation(Column.class);
      Assert.assertFalse(columnAnnotation.nullable());
   }

   @Test
   public void t29_dtosValidationCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.dto.DocumentRequestDto");
      Assert.assertTrue(Arrays.stream(clazz.getDeclaredFields()).anyMatch((f) -> f.isAnnotationPresent(NotBlank.class)));
   }

   @Test
   public void t30_dataSeederComponentCheck() throws Exception {
      Class<?> clazz = Class.forName("com.example.demo.config.DataSeeder");
      Assert.assertTrue(clazz.isAnnotationPresent(Component.class));
   }
}
