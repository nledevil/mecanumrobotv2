/**
 * Keyestudio Mecanum Micro:bit V2
 * Re-written by Ryan Schultz
 */
const enum IrButton {
    //% block=" "
    Any = -1,
    //% block="▲"
    Up = 70,
    //% block=" "
    Unused_2 = -2,
    //% block="◀"
    Left = 68,
    //% block="OK"
    Ok = 64,
    //% block="▶"
    Right = 67,
    //% block=" "
    Unused_3 = -3,
    //% block="▼"
    Down = 21,
    //% block=" "
    Unused_4 = -4,
    //% block="1"
    Number_1 = 22,
    //% block="2"
    Number_2 = 25,
    //% block="3"
    Number_3 = 13,
    //% block="4"
    Number_4 = 12,
    //% block="5"
    Number_5 = 24,
    //% block="6"
    Number_6 = 94,
    //% block="7"
    Number_7 = 8,
    //% block="8"
    Number_8 = 28,
    //% block="9"
    Number_9 = 90,
    //% block="*"
    Star = 66,
    //% block="0"
    Number_0 = 82,
    //% block="#"
    Hash = 74
}
enum MotorLoc {
    Front_left = 0,
    Back_left = 1,
    Front_right = 2,
    Back_right = 3,
}
enum MotorDir {
    Forward = 0,
    Reverse = 1
};
enum MotorState {
    stop = 0,
    brake = 1
}
enum LEDLoc {
    Left = 0x09,
    Right = 0x0a
}
enum LEDState {
    ON = 4095,
    OFF = 0
}
//% color="#AA278D" weight=100
//% groups="['Motor', 'LED', 'Servo', 'Sensors']"
namespace mecanumRobotV2 {
    export enum Servos {
        D14 = 14,
        D15 = 15
    };
    const STC15_ADDRESS = 0x30;   //device address

    function i2cWrite(STC15_ADDRESS: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(STC15_ADDRESS, buf)

    }

    //% block="Run $M motor $D at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function ControlMotor(M: MotorLoc, D: MotorDir, speed: number) {
        let speed_value = Math.map(speed, 0, 100, 0, 255);
        if (M == 2 && D == 1) {
            i2cWrite(0x30, 0x01, speed_value); //M1A
            i2cWrite(0x30, 0x02, 0); //M1B
        }
        if (M == 2 && D == 0) {
            i2cWrite(0x30, 0x01, 0); //M1A
            i2cWrite(0x30, 0x02, speed_value); //M1B
        }
        if (M == 0 && D == 0) {
            i2cWrite(0x30, 0x03, 0); //M2A
            i2cWrite(0x30, 0x04, speed_value); //M2B
        }
        if (M == 0 && D == 1) {
            i2cWrite(0x30, 0x03, speed_value); //M2A
            i2cWrite(0x30, 0x04, 0); //M2B
        }
        if (M == 3 && D == 1) {
            i2cWrite(0x30, 0x05, speed_value); //M3A
            i2cWrite(0x30, 0x06, 0); //M3B
        }
        if (M == 3 && D == 0) {
            i2cWrite(0x30, 0x05, 0); //M3A
            i2cWrite(0x30, 0x06, speed_value); //M3B
        }
        if (M == 1 && D == 0) {
            i2cWrite(0x30, 0x07, 0); //M4A
            i2cWrite(0x30, 0x08, speed_value); //M4B
        }
        if (M == 1 && D == 1) {
            i2cWrite(0x30, 0x07, speed_value); //M4A
            i2cWrite(0x30, 0x08, 0); //M4B
        }
    }

    //% block="Drive Forward at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function DriveForward(speed: number) {
        ControlMotor(0, 0, speed);
        ControlMotor(1, 0, speed);
        ControlMotor(2, 0, speed);
        ControlMotor(3, 0, speed);
    };

    //% block="Drive Back at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function DriveBack(speed: number) {
        ControlMotor(0, 1, speed);
        ControlMotor(1, 1, speed);
        ControlMotor(2, 1, speed);
        ControlMotor(3, 1, speed);
    };

    //% block="Strafe Left at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function StrafeLeft(speed: number) {
        ControlMotor(0, 1, speed);
        ControlMotor(1, 0, speed);
        ControlMotor(2, 0, speed);
        ControlMotor(3, 1, speed);
    };

    //% block="Strafe Right at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function StrafeRight(speed: number) {
        ControlMotor(0, 0, speed);
        ControlMotor(1, 1, speed);
        ControlMotor(2, 1, speed);
        ControlMotor(3, 0, speed);
    };

    //% block="Rotate Right at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function RotateRight(speed: number) {
        ControlMotor(0, 0, speed);
        ControlMotor(1, 0, speed);
        ControlMotor(2, 1, speed);
        ControlMotor(3, 1, speed);
    };

    //% block="Rotate Left at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function RotateLeft(speed: number) {
        ControlMotor(0, 1, speed);
        ControlMotor(1, 1, speed);
        ControlMotor(2, 0, speed);
        ControlMotor(3, 0, speed);
    };

    //% block="Stop Motors"
    //% group="Motor"
    export function StopMotor() {
        //stop
        i2cWrite(0x30, 0x01, 0); //M1A
        i2cWrite(0x30, 0x02, 0); //M1B
        i2cWrite(0x30, 0x03, 0); //M1A
        i2cWrite(0x30, 0x04, 0); //M1B
        i2cWrite(0x30, 0x05, 0); //M1A
        i2cWrite(0x30, 0x06, 0); //M1B
        i2cWrite(0x30, 0x07, 0); //M1A
        i2cWrite(0x30, 0x08, 0); //M1B
    }

    //% block="Turn $LedC LED $LedS"
    //% group="LED" weight=76
    export function setLed(LedC: LEDLoc, LedS: LEDState) {
        i2cWrite(0x30, LedC, LedS);
    }

    //% block="Set SERVO to angle %angle"
    //% group="Servo" weight=70
    //% angle.min=-90 angle.max.max=90
    export function setServo(angle: number): void {
        pins.servoWritePin(AnalogPin.P14, angle)
    }

    let lastTime = 0;
    
    //% block="Ultrasonic Value"
    //% group="Sensors" weight=68
    export function ultra(): number {
        //send trig pulse
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P15, 0)
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P15, 1)
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P15, 0)

        // read echo pulse  max distance : 6m(35000us)  
        let t = pins.pulseIn(DigitalPin.P16, PulseValue.High, 35000);
        let ret = t;

        //Eliminate the occasional bad data
        if (ret == 0 && lastTime != 0) {
            ret = lastTime;
        }
        lastTime = t;

        return Math.round(ret / 58);
    }

    class irReceiver {
        constructor() {
            this.address = 0;
            this.command = 0;
        }
        address: number;
        command: number;
        IR_pin: DigitalPin;
    }
    
    //create a IR receiver class
    let IR_R = new irReceiver;

    //define nec_IR maximum number of pulses is 33.
    //create 2 pulse cache array.
    let maxPulse: number = 33;
    let low_pulse: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let high_pulse: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    //must define for 33,
    //otherwise there is a risk of error in receiving the first data.
    let LpulseCounter: number = 33;
    let HpulseCounter: number = 33;

    let LpulseTime: number = 0;
    let HpulseTime: number = 0;

    function irInit(IR_pin: DigitalPin) {
        pins.onPulsed(IR_pin, PulseValue.Low, () => {      //interrupt event
            LpulseTime = pins.pulseDuration();             //measure the pulse
            if (6750 < LpulseTime && LpulseTime < 11250) { //9ms
                LpulseCounter = 0;
            }
            if (LpulseCounter < maxPulse /*&& repeatedPulse == false*/) {
                low_pulse[LpulseCounter] = LpulseTime;
                LpulseCounter += 1;
            }
        });
        pins.onPulsed(IR_pin, PulseValue.High, () => {
            HpulseTime = pins.pulseDuration();
            /*if (1687 < HpulseTime && HpulseTime < 2812) {  //2.25ms
                repeatedPulse = true;
            }*/
            if (3375 < HpulseTime && HpulseTime < 5625) {    //4.5ms
                HpulseCounter = 0;
                //repeatedPulse = false;
            }
            if (HpulseCounter < maxPulse /*&& repeatedPulse == false*/) {
                high_pulse[HpulseCounter] = HpulseTime;
                HpulseCounter += 1;
            }
        });
    }

    function irDataProcessing() {
        let tempAddress: number = 0;
        let inverseAddress: number = 0;
        let tempCommand: number = 0;
        let inverseCommand: number = 0;
        let num: number;
        //confirm start pulse
        if (6750 < low_pulse[0] && low_pulse[0] < 11250 && HpulseCounter >= 33) {  //9ms
            //conver the pulse into data
            for (num = 1; num < maxPulse; num++) {
                //if (420 < low_pulse[num] && low_pulse[num] < 700) {      //0.56ms
                if (1267 < high_pulse[num] && high_pulse[num] < 2112) {    //1.69ms = 1, 0.56ms = 0
                    if (1 <= num && num < 9) {    //conver the pulse into address
                        tempAddress |= 1 << (num - 1);
                    }
                    if (9 <= num && num < 17) {   //conver the pulse into inverse address
                        inverseAddress |= 1 << (num - 9);
                    }
                    if (17 <= num && num < 25) {   //conver the pulse into command
                        tempCommand |= 1 << (num - 17);
                    }
                    if (25 <= num && num < 33) {   //conver the pulse into inverse command
                        inverseCommand |= 1 << (num - 25);
                    }
                }
                //}
            }
            low_pulse[0] = 0;
            //check the data and return the data to IR receiver class.
            if ((tempAddress + inverseAddress == 0xff) && (tempCommand + inverseCommand == 0xff)) {
                IR_R.address = tempAddress;
                IR_R.command = tempCommand;
                return;
            } else {  //Return -1 if check error.
                IR_R.address = -1;
                IR_R.command = -1;
                return;
            }
        }
        IR_R.address = 0;
        IR_R.command = 0;
    }

    //% blockId="infrared_connect"
    //% block="connect IR receiver at %IR_pin"
    //% IR_pin.fieldEditor="gridpicker"
    //% IR_pin.fieldOptions.columns=4
    //% IR_pin.fieldOptions.tooltips="false"
    //% group = "Sensors" weight=99
    export function connectInfrared(IR_pin: DigitalPin): void {
        IR_R.IR_pin = IR_pin;   //define IR receiver control pin
        pins.setPull(IR_R.IR_pin, PinPullMode.PullUp);
        irInit(IR_R.IR_pin);   //initialize the IR receiver
    }

    //% blockId=infrared_button
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% block="IR button %button"
    //% group = "Sensors" weight=98
    export function irButton(button: IrButton): number {
        return button as number;
    }

    //% blockId=infrared_pressed_button
    //% block="IR button"
    //% group = "Sensors" weight=97
    export function returnIrButton(): number {
        irDataProcessing();
        basic.pause(80);      //Delay by one infrared receiving period
        return IR_R.command;
    }
}