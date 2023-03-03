import { vec3 } from 'gl-matrix';
export const Float32ArrayConcat = (first, second) => {
    var firstLength = first.length,
    result = new Float32Array(firstLength + second.length);
    result.set(first);
    result.set(second, firstLength);
    return result;
}
export const Seashell = (u, v, center=[0,0,0]) => {
    let x = 2*(-1+Math.exp(u/(6*Math.PI)))*Math.sin(u)*Math.pow(Math.cos(v/2),2);
    let y = 1 - Math.exp(u/(3*Math.PI))-Math.sin(v) + Math.exp(u/(6*Math.PI))*Math.sin(v);
    let z = 2*(1-Math.exp(u/(6*Math.PI)))*Math.cos(u)*Math.pow(Math.cos(v/2),2);
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const Breather = (u, v, center=[0,0,0]) => {
    const a = 0.4; // where 0 < a < 1

    let x = -u+(2*(1-a*a)*Math.cosh(a*u)*Math.sinh(a*u))/(a*((1-a*a)*Math.pow((Math.cosh(a*u)),2)+a*a*Math.pow((Math.sin(Math.sqrt(1-a*a)*v)),2)));
    let y = (2*Math.sqrt(1-a*a)*Math.cosh(a*u)*(-(Math.sqrt(1-a*a)*Math.cos(v)*Math.cos(Math.sqrt(1-a*a)*v)) - 
            Math.sin(v)*Math.sin(Math.sqrt(1-a*a)*v)))/(a*((1-a*a)*Math.pow(Math.cosh(a*u),2)+a*a*Math.pow(Math.sin(Math.sqrt(1-a*a)*v),2)));
    let z = (2*Math.sqrt(1-a*a)*Math.cosh(a*u)*(-(Math.sqrt(1-a*a)*Math.sin(v)*Math.cos(Math.sqrt(1-a*a)*v)) + 
            Math.cos(v)*Math.sin(Math.sqrt(1-a*a)*v)))/(a*((1-a*a)*Math.pow(Math.cosh(a*u),2)+a*a*Math.pow(Math.sin(Math.sqrt(1-a*a)*v),2)));

    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const SievertEnneper = (u, v, center=[0,0,0]) => {
    const a = 1.0;

    let x = Math.log(Math.tan(v/2))/Math.sqrt(a) + 2*(1+a)*Math.cos(v)/(1+a-a*Math.sin(v)*Math.sin(v)*Math.cos(u)*Math.cos(u))/Math.sqrt(a);
    let y = (2*Math.sin(v)*Math.sqrt((1+1/a)*(1+a*Math.sin(u)*Math.sin(u))))/(1+a-a*Math.sin(v)*Math.sin(v)*Math.cos(u)*Math.cos(u))*
            Math.sin(Math.atan(Math.sqrt(1+a)*Math.tan(u))-u/Math.sqrt(1+a));
    let z = (2*Math.sin(v)*Math.sqrt((1+1/a)*(1+a*Math.sin(u)*Math.sin(u))))/(1+a-a*Math.sin(v)*Math.sin(v)*Math.cos(u)*Math.cos(u))*
            Math.cos(Math.atan(Math.sqrt(1+a)*Math.tan(u))-u/Math.sqrt(1+a));

    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const SnailShell = (u, v, center=[0,0,0]) => {
    let x = 2*(-1+Math.exp(u/(6*Math.PI)))*Math.sin(u)*Math.pow(Math.cos(v/2),2);
    let y = 1 - Math.exp(u/(3*Math.PI))-Math.sin(v) + Math.exp(u/(6*Math.PI))*Math.sin(v);
    let z = 2*(1-Math.exp(u/(6*Math.PI)))*Math.cos(u)*Math.pow(Math.cos(v/2),2);
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const Wellenkugel = (u, v, center=[0,0,0]) => {
    let x = u*Math.cos(Math.cos(u))*Math.sin(v);        
    let y = u*Math.sin(Math.cos(u));
    let z = u*Math.cos(Math.cos(u))*Math.cos(v);       
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const KleinBottle = (u, v, center=[0,0,0]) => {
    let x = 2/15*(3+5*Math.cos(u)*Math.sin(u))*Math.sin(v);    
    let y = -1/15*Math.sin(u)*(3*Math.cos(v)-3*Math.pow(Math.cos(u),2)*Math.cos(v)-
            48*Math.pow(Math.cos(u),4)*Math.cos(v)+48*Math.pow(Math.cos(u),6)*Math.cos(v)-
            60*Math.sin(u)+5*Math.cos(u)*Math.cos(v)*Math.sin(u)- 
            5*Math.pow(Math.cos(u),3)*Math.cos(v)*Math.sin(u)-
            80*Math.pow(Math.cos(u),5)*Math.cos(v)*Math.sin(u)+
            80*Math.pow(Math.cos(u),7)*Math.cos(v)*Math.sin(u));
    let z = -2/15*Math.cos(u)*(3*Math.cos(v)-30*Math.sin(u)+
            90*Math.pow(Math.cos(u),4)*Math.sin(u)-60*Math.pow(Math.cos(u),6)*Math.sin(u)+
            5*Math.cos(u)*Math.cos(v)*Math.sin(u));
   
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const Peaks = (x, z, center = [0,0,0]) => {
    let y = 3*(1-z)*(1-z)*Math.exp(-(z*z)-(x+1)*(x+1))-10*(z/5-z*z*z-x*x*x*x*x)*Math.exp(-z*z-x*x)-1/3*Math.exp(-(z+1)*(z+1)-x*x);
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const Sinc = (x, z, center = [0,0,0]) => {
    let r = Math.sqrt(x*x + z*z) + 0.00001;
    let y = Math.sin(r)/r;
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
};

export const TorusPosition = (R, r, u, v, center = [0,0,0]) => {
    let snu = Math.sin(u*Math.PI/180);
    let cnu = Math.cos(u*Math.PI/180);
    let snv = Math.sin(v*Math.PI/180);
    let cnv = Math.cos(v*Math.PI/180);
    return vec3.fromValues((R+r*cnv)*cnu + center[0], r*snv + center[1], -(R+r*cnv)*snu + center[2]);        
};

export const ConePosition = (radius, theta, y, center = [0,0,0]) => {
    let sn = Math.sin(theta*Math.PI/180);
    let cn = Math.cos(theta*Math.PI/180);
    return vec3.fromValues(radius*cn + center[0], y + center[1], -radius*sn + center[2]);        
};

export const CylinderPosition = (radius, theta, y, center = [0,0,0]) => {
    let sn = Math.sin(theta*Math.PI/180);
    let cn = Math.cos(theta*Math.PI/180);
    return vec3.fromValues(radius*cn + center[0], y+center[1], -radius*sn + center[2]);        
};

export const SpherePosition = (radius, theta, phi, center = [0,0,0]) => {
    let snt = Math.sin(theta*Math.PI/180);
    let cnt = Math.cos(theta*Math.PI/180);
    let snp = Math.sin(phi*Math.PI/180);
    let cnp = Math.cos(phi*Math.PI/180);
    return vec3.fromValues(radius*snt*cnp + center[0], radius*cnt + center[1], -radius*snt*snp + center[2]);     
};
export const Torus= (u, v, center=[0,0,0]) => {
    let x = (1+0.3*Math.cos(v))*Math.cos(u);    
    let y = 0.3*Math.sin(v);
    let z = (1+0.3*Math.cos(v))*Math.sin(u);  
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
}

export const Sphere = (u, v, center=[0,0,0]) => {
    let x = Math.cos(v)*Math.cos(u);       
    let y = Math.sin(v);
    let z = Math.cos(v)*Math.sin(u);        
    return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
}
