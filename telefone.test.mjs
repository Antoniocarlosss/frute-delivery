import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizarTelefone} from './telefone.js';
test('WhatsApp com DDD, formatação e país',()=>{for(const value of ['69992617094','(69) 99261-7094','+55 (69) 99261-7094','5569992617094'])assert.equal(normalizarTelefone(value),'69992617094')});
test('telefone incompleto e texto rejeitados',()=>{for(const value of ['',undefined,'992617094','abc69992617094','0069992617094'])assert.equal(normalizarTelefone(value),'')});
