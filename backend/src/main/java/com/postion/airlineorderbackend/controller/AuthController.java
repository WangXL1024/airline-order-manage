package com.postion.airlineorderbackend.controller;

import com.postion.airlineorderbackend.dto.ApiResponse;
import com.postion.airlineorderbackend.dto.LoginUserDetails;
import com.postion.airlineorderbackend.model.User;
import com.postion.airlineorderbackend.payload.JwtResponse;
import com.postion.airlineorderbackend.payload.LoginRequest;
import com.postion.airlineorderbackend.repo.UserRepository;
import com.postion.airlineorderbackend.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwtToken = jwtUtils.generateToken((UserDetails) authentication.getPrincipal());
        LoginUserDetails userDetails = (LoginUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwtToken, userDetails));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> registerUser(@RequestBody LoginRequest loginRequest) {
        // 检查用户名是否已存在
        if (userRepository.findByUsername(loginRequest.getUsername()).isPresent()) {
            // 使用error静态方法创建错误响应
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error(400, "用户名已存在"));
        }

        // 创建新用户
        User user = new User();
        user.setUsername(loginRequest.getUsername());
        user.setPassword(passwordEncoder.encode(loginRequest.getPassword())); // 加密密码
        user.setRole("USER"); // 设置默认角色

        User savedUser = userRepository.save(user);

        // 使用success静态方法创建成功响应，可返回创建的用户信息（脱敏处理）
        return ResponseEntity
                .ok(ApiResponse.success("用户注册成功，用户名：" + savedUser.getUsername()));
    }
}    
