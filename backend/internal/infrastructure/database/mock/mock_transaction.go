// Code generated by MockGen. DO NOT EDIT.
// Source: ./internal/infrastructure/database/transaction.go

// Package mock_database is a generated GoMock package.
package mock_database

import (
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	gorm "gorm.io/gorm"
)

// MockTxManager is a mock of TxManager interface.
type MockTxManager struct {
	ctrl     *gomock.Controller
	recorder *MockTxManagerMockRecorder
}

// MockTxManagerMockRecorder is the mock recorder for MockTxManager.
type MockTxManagerMockRecorder struct {
	mock *MockTxManager
}

// NewMockTxManager creates a new mock instance.
func NewMockTxManager(ctrl *gomock.Controller) *MockTxManager {
	mock := &MockTxManager{ctrl: ctrl}
	mock.recorder = &MockTxManagerMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockTxManager) EXPECT() *MockTxManagerMockRecorder {
	return m.recorder
}

// Begin mocks base method.
func (m *MockTxManager) Begin() *gorm.DB {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Begin")
	ret0, _ := ret[0].(*gorm.DB)
	return ret0
}

// Begin indicates an expected call of Begin.
func (mr *MockTxManagerMockRecorder) Begin() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Begin", reflect.TypeOf((*MockTxManager)(nil).Begin))
}

// Commit mocks base method.
func (m *MockTxManager) Commit(arg0 *gorm.DB) {
	m.ctrl.T.Helper()
	m.ctrl.Call(m, "Commit", arg0)
}

// Commit indicates an expected call of Commit.
func (mr *MockTxManagerMockRecorder) Commit(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Commit", reflect.TypeOf((*MockTxManager)(nil).Commit), arg0)
}

// Rollback mocks base method.
func (m *MockTxManager) Rollback(arg0 *gorm.DB) {
	m.ctrl.T.Helper()
	m.ctrl.Call(m, "Rollback", arg0)
}

// Rollback indicates an expected call of Rollback.
func (mr *MockTxManagerMockRecorder) Rollback(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Rollback", reflect.TypeOf((*MockTxManager)(nil).Rollback), arg0)
}
